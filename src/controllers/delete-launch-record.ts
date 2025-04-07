import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable, romTable } from '../databases/library/schema.ts'

interface DeleteRomParams {
  rom: string
}

export async function deleteLaunchRecord(params: DeleteRomParams) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const roms = await library
    .select({ id: romTable.id })
    .from(romTable)
    .where(and(eq(romTable.id, params.rom), eq(romTable.userId, currentUser.id), eq(romTable.status, 1)))
  const [rom] = roms

  const result = await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(
      and(
        eq(launchRecordTable.romId, rom.id),
        eq(launchRecordTable.userId, currentUser.id),
        eq(launchRecordTable.status, 1),
      ),
    )
    .returning()

  return result
}
