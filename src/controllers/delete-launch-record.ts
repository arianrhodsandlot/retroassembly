import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable } from '../databases/schema.ts'

interface DeleteRomParams {
  rom: string
}

export async function deleteLaunchRecord(params: DeleteRomParams) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const result = await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(
      and(
        eq(launchRecordTable.romId, params.rom),
        eq(launchRecordTable.userId, currentUser.id),
        eq(launchRecordTable.status, 1),
      ),
    )
    .returning()

  return result
}
