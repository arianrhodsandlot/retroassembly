import { and, count, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { rom } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  launchboxGameId: number | undefined
  libretroGameId: string | undefined
  platform: string
}

async function createRom(params: CreateRomParams) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const where = and(
    eq(rom.user_id, currentUser.id),
    eq(rom.file_name, params.fileName),
    eq(rom.platform, params.platform),
  )
  const [countResult] = await library.select({ count: count() }).from(rom).where(where)

  const value = {
    file_id: params.fileId,
    file_name: params.fileName,
    launchbox_game_id: params.launchboxGameId,
    libretro_game_id: params.libretroGameId,
    platform: params.platform,
    user_id: currentUser.id,
  }

  if (countResult.count) {
    await library.update(rom).set(value).where(where)
    return
  }

  const [result] = await library.insert(rom).values(value).returning()

  return result
}

export async function createRoms({ files, platform }: { files: File[]; platform: string }) {
  const { storage } = getContextData()

  const roms = await Promise.all(
    files.map(async (file) => {
      const { launchbox, libretro } = await guessGameInfo(file.name, platform)
      const fileId = nanoid()
      await storage.put(fileId, file)
      const rom = await createRom({
        fileId,
        fileName: file.name,
        launchboxGameId: launchbox?.database_id,
        libretroGameId: libretro?.id,
        platform,
      })
      return rom
    }),
  )

  return roms
}
