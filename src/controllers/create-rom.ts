import { and, count, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { rom } from '../databases/library/schema.ts'

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

  const [countResult] = await library
    .select({ count: count() })
    .from(rom)
    .where(and(eq(rom.user_id, currentUser.id), eq(rom.file_name, params.fileName), eq(rom.platform, params.platform)))

  if (countResult.count) {
    return
  }

  const value = {
    file_id: params.fileId,
    file_name: params.fileName,
    launchbox_game_id: params.launchboxGameId,
    libretro_game_id: params.libretroGameId,
    platform: params.platform,
    user_id: currentUser.id,
  }
  const [result] = await library.insert(rom).values(value).returning()

  return result
}
