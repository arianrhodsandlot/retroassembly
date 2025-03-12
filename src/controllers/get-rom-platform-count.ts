import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '../databases/library/schema.ts'

export async function getRomPlatformCount() {
  const { currentUser, db } = getContextData()
  const { library } = db

  const results = await library
    .selectDistinct({ platform: romTable.platform })
    .from(romTable)
    .orderBy(romTable.file_name)
    .where(and(eq(romTable.user_id, currentUser.id), eq(romTable.status, 1)))

  return results.length
}
