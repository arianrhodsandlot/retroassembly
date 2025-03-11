import { and, eq, inArray, type InferSelectModel } from 'drizzle-orm'
import { compact, keyBy } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '../databases/library/schema.ts'
import { launchboxGameTable, libretroGameTable } from '../databases/metadata/schema.ts'

async function getMetadata(romResults: InferSelectModel<typeof romTable>[]) {
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

export async function getRoms({ id, platform }: { id?: string; platform?: string } = {}) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const conditions = [eq(romTable.user_id, currentUser.id), eq(romTable.status, 1)]
  if (id) {
    conditions.push(eq(romTable.id, id))
  }
  if (platform) {
    conditions.push(eq(romTable.platform, platform))
  }
  const where = and(...conditions)
  const romResults = await library.select().from(romTable).orderBy(romTable.file_name).where(where).limit(100)

  const results = await getMetadata(romResults)
  return results
}
