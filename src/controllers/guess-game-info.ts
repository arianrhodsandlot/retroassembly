import path from 'node:path'
import { and, eq, or } from 'drizzle-orm'
import { parse } from 'goodcodes-parser'
import { getContextData } from 'waku/middleware/context'
import { platformMap } from '../constants/platform.ts'
import { launchboxGameAlternateNameTable, launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'
import { getCompactName } from '../utils/library.ts'
import { restoreTitleForSorting } from '../utils/misc.ts'

async function guessLibretroGame(fileName: string, platform: string) {
  const { db } = getContextData()
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
  const { db } = getContextData()
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

  const results = await metadata
    .select()
    .from(launchboxGameAlternateNameTable)
    .where(eq(launchboxGameAlternateNameTable.compactName, getCompactName(restoredBaseName)))
    .limit(1)
  const databaseId = results[0]?.databaseId
  if (databaseId) {
    const alternateResults = await metadata
      .select()
      .from(launchboxGameTable)
      .where(
        and(
          eq(launchboxGameTable.databaseId, databaseId),
          eq(launchboxGameTable.platform, platformMap[platform].launchboxName),
        ),
      )
    const alternateResult = alternateResults.at(0)
    if (alternateResult) {
      return alternateResult
    }
  }
}

export async function guessGameInfo(fileName: string, platform: string) {
  let [libretro, launchbox] = await Promise.all([
    guessLibretroGame(fileName, platform),
    guessLaunchboxGame(fileName, platform),
  ])
  if (launchbox && !libretro) {
    libretro = await guessLibretroGame(launchbox.name, platform)
  }
  if (libretro && !launchbox && libretro.name) {
    launchbox = await guessLaunchboxGame(libretro.goodcodesBaseCompactName, platform)
  }

  return { launchbox, libretro }
}
