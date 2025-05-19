import { inArray, type InferSelectModel } from 'drizzle-orm'
import { compact, keyBy } from 'es-toolkit'
import { getContext } from 'hono/context-storage'
import type { romTable } from '@/databases/library/schema.ts'
import { launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'

export async function getRomsMetadata<T extends InferSelectModel<typeof romTable>[]>(romResults: T) {
  const { db } = getContext().var
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
