import { getContextData } from 'waku/middleware/context'
import { launchRecordTable } from '../databases/library/schema.ts'

interface CreateRomParams {
  core: string
  platform: string
  rom: string
}

export async function createLaunchRecord(params: CreateRomParams) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const [result] = await library
    .insert(launchRecordTable)
    .values({
      core: params.core,
      platform: params.platform,
      rom_id: params.rom,
      user_id: currentUser.id,
    })
    .returning()

  return result
}
