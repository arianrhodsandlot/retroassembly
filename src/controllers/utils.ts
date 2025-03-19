import { inArray, type InferSelectModel } from 'drizzle-orm'
import { compact, isNil, isPrimitive, keyBy, mergeWith } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import type { romTable } from '@/databases/library/schema.ts'
import { launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'

export async function getRomsMetadata<T extends InferSelectModel<typeof romTable>[]>(romResults: T) {
  const { db } = getContextData()
  const { metadata } = db
  const launchboxGameIds = compact(romResults.map((romResult) => romResult.launchboxGameId))
  const launchboxResults = await metadata
    .select()
    .from(launchboxGameTable)
    .where(inArray(launchboxGameTable.databaseId, launchboxGameIds))
  const launchboxResultMap = keyBy(launchboxResults, (launchboxResult) => launchboxResult.databaseId)

  const libretroGameIds = compact(romResults.map((romResult) => romResult.libretroGameId))
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
    if (result.libretroGameId) {
      result.libretroGame = libretroResultMap[result.libretroGameId]
    }
    if (result.launchboxGameId) {
      result.launchboxGame = launchboxResultMap[result.launchboxGameId]
    }
  }

  return results
}

export function mergePreference(target: any, source: any) {
  const safeTarget = target || {}
  mergeWith(safeTarget, source || {}, (targetValue, sourceValue) => {
    if (isNil(sourceValue)) {
      return targetValue
    }
    if (Array.isArray(sourceValue)) {
      return sourceValue
    }
    if (isPrimitive(sourceValue)) {
      return sourceValue
    }
    mergePreference(targetValue, sourceValue)
    return targetValue
  })
  return safeTarget
}
