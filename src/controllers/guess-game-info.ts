import path from 'node:path'
import { and, eq, or } from 'drizzle-orm'
import { parse } from 'goodcodes-parser'
import { getContextData } from 'waku/middleware/context'
import { platformMap } from '../constants/platform.ts'
import { launchboxGame, launchboxGameAlternateName, libretroGame } from '../databases/metadata/schema.ts'
import { restoreTitleForSorting } from '../utils/misc.ts'
import { getCompactName } from '../utils/rom.ts'

async function guessLibretroGame(fileName: string, platform: string) {
  const { db } = getContextData()
  const { metadata } = db

  const baseName = path.parse(fileName).name
  const goodcodes = parse(`0 - ${baseName}`)
  const goodcodesCompactName = getCompactName(goodcodes.rom)
  const filters = [
    eq(libretroGame.rom_name, fileName),
    eq(libretroGame.compact_name, getCompactName(baseName)),
    eq(libretroGame.goodcodes_base_compact_name, goodcodesCompactName),
  ]
  if (goodcodesCompactName.startsWith('the')) {
    filters.push(eq(libretroGame.goodcodes_base_compact_name, `${goodcodesCompactName.replace(/^the/, '')}the`))
  }

  const results = await metadata
    .select()
    .from(libretroGame)
    .where(and(or(...filters), eq(libretroGame.platform, platformMap[platform].libretroName)))
    .limit(1)
  return results.at(0)
}

async function guessLaunchboxGame(fileName: string, platform: string) {
  const { db } = getContextData()
  const { metadata } = db

  const baseName = path.parse(fileName).name
  const restoredBaseName = restoreTitleForSorting(parse(`0 - ${baseName}`).rom)
  const goodcodes = parse(`0 - ${restoredBaseName}`)
  const exactResults = await metadata
    .select()
    .from(launchboxGame)
    .where(
      and(
        or(
          eq(launchboxGame.compact_name, getCompactName(restoredBaseName)),
          eq(launchboxGame.goodcodes_base_compact_name, getCompactName(goodcodes.rom)),
        ),
        eq(launchboxGame.platform, platformMap[platform].launchboxName),
      ),
    )
    .limit(1)

  const exactResult = exactResults.at(0)
  if (exactResult) {
    return exactResult
  }

  const results = await metadata
    .select()
    .from(launchboxGameAlternateName)
    .where(eq(launchboxGameAlternateName.compact_name, getCompactName(restoredBaseName)))
    .limit(1)
  const databaseId = results[0]?.database_id
  if (databaseId) {
    const alternateResults = await metadata
      .select()
      .from(launchboxGame)
      .where(
        and(eq(launchboxGame.database_id, databaseId), eq(launchboxGame.platform, platformMap[platform].launchboxName)),
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

  return { launchbox, libretro }
}
