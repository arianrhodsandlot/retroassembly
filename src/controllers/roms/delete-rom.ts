import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable, romTable } from '@/databases/schema.ts'

export async function deleteRom(id: string) {
  const { currentUser, db } = getContext().var

  const { library } = db

  await library
    .update(romTable)
    .set({ status: 0 })
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id)))

  await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(and(eq(launchRecordTable.romId, id), eq(launchRecordTable.userId, currentUser.id)))
}
