import { inArray, type InferSelectModel } from 'drizzle-orm'
import { compact, keyBy, mergeWith } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import { launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'

interface RomModelLike {
  id: string
  launchbox_game_id: null | number
  libretro_game_id: null | string
}

export async function getRomsMetadata<T extends RomModelLike[]>(romResults: T) {
  const { db } = getContextData()
  const { metadata } = db
  const launchboxGameIds = compact(romResults.map((romResult) => romResult.launchbox_game_id))
  const launchboxResults = await metadata
    .select()
    .from(launchboxGameTable)
    .where(inArray(launchboxGameTable.database_id, launchboxGameIds))
  const launchboxResultMap = keyBy(launchboxResults, (launchboxResult) => launchboxResult.database_id)

  const libretroGameIds = compact(romResults.map((romResult) => romResult.libretro_game_id))
  const libretroResults = await metadata
    .select()
    .from(libretroGameTable)
    .where(inArray(libretroGameTable.id, libretroGameIds))
  const libretroResultMap = keyBy(libretroResults, (libretroResult) => libretroResult.id)

  const results = romResults.map((romResult) => ({
    ...romResult,
    launchboxGame: null as InferSelectModel<typeof launchboxGameTable> | null,
    libretroGame: null as InferSelectModel<typeof libretroGameTable> | null,
  }))

  for (const result of results) {
    if (result.libretro_game_id) {
      result.libretroGame = libretroResultMap[result.libretro_game_id]
    }
    if (result.launchbox_game_id) {
      result.launchboxGame = launchboxResultMap[result.launchbox_game_id]
    }
  }

  return results
}

export function mergePreference(target: any, source: any) {
  mergeWith(target, source || {}, (targetValue, sourceValue) => {
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      return sourceValue
    }
  })
}
