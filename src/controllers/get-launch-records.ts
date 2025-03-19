import { and, count, countDistinct, desc, eq, max } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { launchRecordTable, romTable } from '../databases/library/schema.ts'
import { getRomsMetadata } from './utils.ts'

export async function getLaunchRecords({ page = 1, pageSize = 50 }: { page?: number; pageSize?: number }) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const offset = (page - 1) * pageSize

  const where = and(eq(launchRecordTable.userId, currentUser.id), eq(launchRecordTable.status, 1))

  const results = await library
    .select({
      core: launchRecordTable.core,
      count: count(launchRecordTable.id),
      file_name: romTable.fileName,
      id: launchRecordTable.romId,
      lastLaunched: max(launchRecordTable.createdAt),
      launchbox_game_id: romTable.launchboxGameId,
      libretro_game_id: romTable.libretroGameId,
      platform: launchRecordTable.platform,
    })
    .from(launchRecordTable)
    .where(where)
    .leftJoin(romTable, eq(launchRecordTable.romId, romTable.id))
    .groupBy(launchRecordTable.romId, romTable.fileName, romTable.launchboxGameId, romTable.libretroGameId)
    .orderBy(desc(max(launchRecordTable.createdAt)))
    .offset(offset)
    .limit(pageSize)

  const [{ total }] = await library
    .select({ total: countDistinct(launchRecordTable.romId) })
    .from(launchRecordTable)
    .where(where)
  const pagination = { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }
  const roms = await getRomsMetadata(results)
  return {
    pagination,
    roms,
  }
}
