import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '@/databases/library/schema.ts'

export async function getRomContent(id: string) {
  const { currentUser, db, storage } = getContextData()

  const [result] = await db.library
    .select()
    .from(romTable)
    .orderBy(romTable.file_name)
    .where(and(eq(romTable.id, id), eq(romTable.user_id, currentUser.id), eq(romTable.status, 1)))

  const object = await storage.get(result.file_id)
  return object
}
