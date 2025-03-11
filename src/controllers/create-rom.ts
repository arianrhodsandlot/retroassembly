import { and, count, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '../databases/library/schema.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  launchboxGameId: number | undefined
  libretroGameId: string | undefined
  platform: string
}

export async function createRom(params: CreateRomParams) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const where = and(
    eq(romTable.user_id, currentUser.id),
    eq(romTable.file_name, params.fileName),
    eq(romTable.platform, params.platform),
  )
  const [countResult] = await library.select({ count: count() }).from(romTable).where(where)

  const value = {
    file_id: params.fileId,
    file_name: params.fileName,
    launchbox_game_id: params.launchboxGameId,
    libretro_game_id: params.libretroGameId,
    platform: params.platform,
    user_id: currentUser.id,
  }

  if (countResult.count) {
    await library.update(romTable).set(value).where(where)
    return
  }

  const [result] = await library.insert(romTable).values(value).returning()

  return result
}
