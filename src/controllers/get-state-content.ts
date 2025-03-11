import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { state } from '../databases/library/schema.ts'

export async function getStateContent(id: string, type?: string) {
  const { currentUser, db, storage } = getContextData()

  const [result] = await db.library
    .select()
    .from(state)
    .where(and(eq(state.id, id), eq(state.user_id, currentUser.id), eq(state.status, 1)))
    .limit(1)

  const fileId = type === 'thumbnail' ? result.thumbnail_file_id : result.file_id
  const object = await storage.get(fileId)
  return object
}
