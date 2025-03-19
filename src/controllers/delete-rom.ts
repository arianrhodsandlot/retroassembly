import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { launchRecordTable, romTable } from '../databases/library/schema.ts'

export async function deleteRom(id: string) {
  const { currentUser, db } = getContextData()
  const { library } = db

  await library
    .update(romTable)
    .set({ status: 0 })
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id)))

  await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(and(eq(launchRecordTable.id, id), eq(romTable.userId, currentUser.id)))
}
