import { and, eq, inArray } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { stateTable } from '#@/databases/schema.ts'

export async function deleteStates(ids: string[]) {
  const { currentUser, db, storage } = getContext().var

  const states = await db.library
    .update(stateTable)
    .set({ status: 0 })
    .where(and(inArray(stateTable.id, ids), eq(stateTable.userId, currentUser.id)))
    .returning()

  const fileIds = states.flatMap((state) => [state.fileId, state.thumbnailFileId])
  await Promise.allSettled(fileIds.map((fileId) => storage.delete(fileId)))
}
