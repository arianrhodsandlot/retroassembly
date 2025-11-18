import { and, eq, inArray } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable, romTable } from '#@/databases/schema.ts'

export async function deleteRoms(ids: string[]) {
  const { currentUser, db } = getContext().var
  const { library } = db

  if (ids.length === 0) {
    return
  }

  await library
    .update(romTable)
    .set({ status: 0 })
    .where(and(inArray(romTable.id, ids), eq(romTable.userId, currentUser.id)))

  await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(and(inArray(launchRecordTable.romId, ids), eq(launchRecordTable.userId, currentUser.id)))
}
