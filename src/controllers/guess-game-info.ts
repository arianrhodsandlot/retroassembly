import crypto from 'node:crypto'
import path from 'node:path'
import { and, eq, inArray, or } from 'drizzle-orm'
import { compact } from 'es-toolkit'
import { getContext } from 'hono/context-storage'
import { loadAsync } from 'jszip'
import { parse } from '@/utils/goodcodes-parser.ts'
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

async function getZipEntryMd5(file: File): Promise<string | undefined> {
  const buffer = await file.arrayBuffer()
  const { files } = await loadAsync(buffer) // eslint-disable-line sonarjs/no-unsafe-unzip
  for (const name in files) {
    const entry = files[name]
    if (!entry.dir) {
      const buffer = await entry.async('nodebuffer')
      if (buffer.length > 0) {
        const hash = crypto.createHash('md5') // eslint-disable-line sonarjs/hashing
        hash.update(buffer)
        const md5 = hash.digest('hex')
        if (md5) {
          return md5
        }
      }
    }
  }
}

async function guessLibretroGameByMd5FromZip(file: File, platform: string) {
  const md5 = await getZipEntryMd5(file)
  if (md5) {
    const result = await guessLibretroGameByMd5({ md5, platform })
    if (result) {
      return result
    }
  }
}

function isTinyZip(file?: File): file is File {
  if (!file) {
    return false
  }
  if (file.size > 50 * 1024 * 1024) {
    return false
  }
  return file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
}

async function guessLibretroGameByMd5({ file, md5, platform }: { file?: File; md5: string; platform: string }) {
  const { db } = getContext().var
  const { metadata } = db

  const filters = [
    [
      { column: libretroGameTable.md5, value: md5 },
      { column: libretroGameTable.platform, value: platformMap[platform].libretroName },
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

  if (isTinyZip(file)) {
    return guessLibretroGameByMd5FromZip(file, platform)
  }
}

async function guessLibretroGameByName(fileName: string, platform: string) {
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

async function guessLibretroGame(file: File, platform: string, md5: string) {
  if (platform === 'arcade') {
    return guessLibretroArcadeGame(file.name, md5)
  }

  const md5Result = await guessLibretroGameByMd5({ file, md5, platform })
  if (md5Result) {
    return md5Result
  }

  const nameResult = await guessLibretroGameByName(file.name, platform)
  if (nameResult) {
    return nameResult
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

export async function guessGameInfo(file: File, platform: string, md5: string) {
  let [libretro, launchbox] = await Promise.all([
    guessLibretroGame(file, platform, md5),
    guessLaunchboxGame(file.name, platform),
  ])
  if (launchbox && !libretro) {
    libretro = await guessLibretroGameByName(launchbox.name, platform)
  }
  if (libretro?.name && !launchbox) {
    launchbox = await guessLaunchboxGame(libretro.goodcodesBaseCompactName, platform)
  }

  return { launchbox, libretro }
}
