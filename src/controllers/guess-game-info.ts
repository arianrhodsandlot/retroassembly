import path from 'node:path'
import { and, eq, inArray, or } from 'drizzle-orm'
import { compact } from 'es-toolkit'
import { parse } from 'goodcodes-parser'
import { getContext } from 'hono/context-storage'
import { platformMap } from '../constants/platform.ts'
import { launchboxGameAlternateNameTable, launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'
import { getCompactName } from '../utils/library.ts'
import { restoreTitleForSorting } from '../utils/misc.ts'

async function guessLibretroArcadeGame(fileName: string, md5: string) {
  const { db } = getContext().var
  const { metadata } = db

  const filters = [
    [
      { column: libretroGameTable.md5, value: md5 },
      { column: libretroGameTable.platform, value: 'MAME' },
    ],
    [
      { column: libretroGameTable.md5, value: md5 },
      { column: libretroGameTable.platform, value: 'MAME 2003-Plus' },
    ],
    [
      { column: libretroGameTable.md5, value: md5 },
      { column: libretroGameTable.platform, value: 'FBNeo - Arcade Games' },
    ],
    [
      { column: libretroGameTable.romName, value: fileName },
      { column: libretroGameTable.platform, value: 'MAME' },
    ],
    [
      { column: libretroGameTable.romName, value: fileName },
      { column: libretroGameTable.platform, value: 'MAME 2003-Plus' },
    ],
    [
      { column: libretroGameTable.romName, value: fileName },
      { column: libretroGameTable.platform, value: 'FBNeo - Arcade Games' },
    ],
  ]

  for (const filter of filters) {
    const results = await metadata
      .select()
      .from(libretroGameTable)
      .where(and(...filter.map(({ column, value }) => eq(column, value))))
    if (results.length > 0) {
      return results.at(0)
    }
  }
}

async function guessLibretroGame(fileName: string, platform: string, md5: string) {
  if (platform === 'arcade') {
    return guessLibretroArcadeGame(fileName, md5)
  }

  const { db } = getContext().var
  const { metadata } = db

  const baseName = path.parse(fileName).name
  const goodcodes = parse(`0 - ${baseName}`)
  const goodcodesCompactName = getCompactName(goodcodes.rom)

  const filters = [
    { column: libretroGameTable.romName, value: fileName },
    { column: libretroGameTable.name, value: baseName },
    { column: libretroGameTable.compactName, value: getCompactName(baseName) },
    { column: libretroGameTable.goodcodesBaseCompactName, value: goodcodesCompactName },
  ]
  if (goodcodesCompactName.startsWith('the')) {
    filters.push({
      column: libretroGameTable.goodcodesBaseCompactName,
      value: `${goodcodesCompactName.replace(/^the/, '')}the`,
    })
  }

  for (const { column, value } of filters) {
    const results = await metadata
      .select()
      .from(libretroGameTable)
      .where(and(eq(column, value), eq(libretroGameTable.platform, platformMap[platform].libretroName)))
    if (results.length > 0) {
      return results.at(0)
    }
  }
}

async function guessLaunchboxGame(fileName: string, platform: string) {
  const { db } = getContext().var
  const { metadata } = db

  const baseName = path.parse(fileName).name
  const restoredBaseName = restoreTitleForSorting(parse(`0 - ${baseName}`).rom)
  const goodcodes = parse(`0 - ${restoredBaseName}`)
  const exactResults = await metadata
    .select()
    .from(launchboxGameTable)
    .where(
      and(
        or(
          eq(launchboxGameTable.compactName, getCompactName(restoredBaseName)),
          eq(launchboxGameTable.goodcodesBaseCompactName, getCompactName(goodcodes.rom)),
        ),
        eq(launchboxGameTable.platform, platformMap[platform].launchboxName),
      ),
    )
    .limit(1)

  const exactResult = exactResults.at(0)
  if (exactResult) {
    return exactResult
  }

  const alternateNameResults = await metadata
    .select()
    .from(launchboxGameAlternateNameTable)
    .where(eq(launchboxGameAlternateNameTable.compactName, getCompactName(restoredBaseName)))
    .limit(100)
  if (alternateNameResults.length > 0) {
    const databaseIds = compact(alternateNameResults.map(({ databaseId }) => databaseId))
    const alternateResults = await metadata
      .select()
      .from(launchboxGameTable)
      .where(
        and(
          inArray(launchboxGameTable.databaseId, databaseIds),
          eq(launchboxGameTable.platform, platformMap[platform].launchboxName),
        ),
      )
      .limit(1)
    const alternateResult = alternateResults.at(0)
    if (alternateResult) {
      return alternateResult
    }
  }
}

export type GameInfo = Awaited<ReturnType<typeof guessGameInfo>>

export async function guessGameInfo(fileName: string, platform: string, md5: string) {
  let [libretro, launchbox] = await Promise.all([
    guessLibretroGame(fileName, platform, md5),
    guessLaunchboxGame(fileName, platform),
  ])
  if (launchbox && !libretro) {
    libretro = await guessLibretroGame(launchbox.name, platform, md5)
  }
  if (libretro?.name && !launchbox) {
    launchbox = await guessLaunchboxGame(libretro.goodcodesBaseCompactName, platform)
  }

  return { launchbox, libretro }
}
