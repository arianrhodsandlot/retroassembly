import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { stateTable } from '../databases/library/schema.ts'

export async function getStateContent(id: string, type?: string) {
  const { currentUser, db, storage } = getContextData()

  const [result] = await db.library
    .select()
    .from(stateTable)
    .where(and(eq(stateTable.id, id), eq(stateTable.userId, currentUser.id), eq(stateTable.status, 1)))
    .limit(1)

  const fileId = type === 'thumbnail' ? result.thumbnailFileId : result.fileId
  const object = await storage.get(fileId)
  return object
}
