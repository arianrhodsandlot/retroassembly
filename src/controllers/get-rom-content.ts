import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '@/databases/library/schema.ts'

export async function getRomContent(id: string) {
  const { currentUser, db, storage } = getContext().var

  const [result] = await db.library
    .select()
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id), eq(romTable.status, 1)))

  const object = await storage.get(result.fileId)
  return object
}
