import { and, count, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { romTable } from '../databases/library/schema.ts'
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
    eq(romTable.user_id, currentUser.id),
    eq(romTable.file_name, params.fileName),
    eq(romTable.platform, params.platform),
    eq(romTable.status, 1),
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
