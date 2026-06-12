import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable, romTable } from '#@/databases/schema.ts'
import { romOwnershipCondition } from '#@/utils/server/shared-rom.ts'

interface CreateRomParams {
  core: string
  rom: string
}

export async function createLaunchRecord(params: CreateRomParams) {
  const { currentUser, db } = getContext().var
  const { library } = db

  // Only allow recording launches for ROMs the user can access: their own uploads or the shared library.
  const results = await library
    .select()
    .from(romTable)
    .where(and(eq(romTable.id, params.rom), romOwnershipCondition(currentUser.id)))
  const [rom] = results
  if (!rom) {
    throw new Error('ROM not found')
  }

  const [result] = await library
    .insert(launchRecordTable)
    .values({
      core: params.core,
      platform: rom.platform,
      romId: rom.id,
      userId: currentUser.id,
    })
    .returning()

  return result
}
