import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { launchRecordTable, romTable } from '../databases/schema.ts'

interface CreateRomParams {
  core: string
  rom: string
}

export async function createLaunchRecord(params: CreateRomParams) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const results = await library.select().from(romTable).where(eq(romTable.id, params.rom))
  const [rom] = results

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
