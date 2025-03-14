import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { launchRecordTable, romTable } from '../databases/library/schema.ts'

interface DeleteRomParams {
  rom: string
}

export async function deleteLaunchRecord(params: DeleteRomParams) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const roms = await library
    .select({ id: romTable.id })
    .from(romTable)
    .where(and(eq(romTable.id, params.rom), eq(romTable.user_id, currentUser.id), eq(romTable.status, 1)))
  const [rom] = roms

  const result = await library
    .update(launchRecordTable)
    .set({ status: 0 })
    .where(
      and(
        eq(launchRecordTable.rom_id, rom.id),
        eq(launchRecordTable.user_id, currentUser.id),
        eq(launchRecordTable.status, 1),
      ),
    )
    .returning()

  return result
}
