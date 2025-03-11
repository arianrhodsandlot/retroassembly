import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { rom } from '@/databases/library/schema.ts'

export async function getRomContent(id: string) {
  const { currentUser, db, storage } = getContextData()

  const [result] = await db.library
    .select()
    .from(rom)
    .orderBy(rom.file_name)
    .where(and(eq(rom.id, id), eq(rom.user_id, currentUser.id), eq(rom.status, 1)))

  const object = await storage.get(result.file_id)
  return object
}
