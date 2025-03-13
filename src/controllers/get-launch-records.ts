import { count, countDistinct, desc, eq, max } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { launchRecordTable, romTable } from '../databases/library/schema.ts'
import { getRomsMetadata } from './utils.ts'

export async function getLaunchRecords({ page = 1, pageSize = 50 }: { page?: number; pageSize?: number }) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const offset = (page - 1) * pageSize
  const results = await library
    .select({
      core: launchRecordTable.core,
      count: count(launchRecordTable.id),
      file_name: romTable.file_name,
      lastLaunched: max(launchRecordTable.created_at),
      launchbox_game_id: romTable.launchbox_game_id,
      libretro_game_id: romTable.libretro_game_id,
      platform: launchRecordTable.platform,
      romId: launchRecordTable.rom_id,
    })
    .from(launchRecordTable)
    .where(eq(launchRecordTable.user_id, currentUser.id))
    .leftJoin(romTable, eq(launchRecordTable.rom_id, romTable.id))
    .groupBy(launchRecordTable.rom_id, romTable.file_name, romTable.launchbox_game_id, romTable.libretro_game_id)
    .orderBy(desc(max(launchRecordTable.created_at)))
    .offset(offset)
    .limit(pageSize)

  const [{ total }] = await library
    .select({
      total: countDistinct(launchRecordTable.rom_id),
    })
    .from(launchRecordTable)
    .where(eq(launchRecordTable.user_id, currentUser.id))
  const pagination = { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }
  const roms = await getRomsMetadata(results)
  return {
    pagination,
    roms,
  }
}
