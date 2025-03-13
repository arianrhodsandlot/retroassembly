import { eq, max } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { launchRecordTable } from '../databases/library/schema.ts'

export async function getLaunchRecords({ page = 1, pageSize = 50 }: { page?: number; pageSize?: number }) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const offset = (page - 1) * pageSize
  const results = await library
    .select({
      core: launchRecordTable.core,
      lastLaunched: max(launchRecordTable.created_at),
      romId: launchRecordTable.rom_id,
      userId: launchRecordTable.user_id,
    })
    .from(launchRecordTable)
    .where(eq(launchRecordTable.user_id, currentUser.id))
    .groupBy(launchRecordTable.rom_id)
    .offset(offset)
    .limit(pageSize)

  return results
}
