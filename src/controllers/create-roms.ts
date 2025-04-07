import { and, count, eq, type InferInsertModel } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { type GameInfo, guessGameInfo } from '../controllers/guess-game-info.ts'
import { romTable } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  gameInfo: GameInfo
  platform: string
}

async function createRom(params: CreateRomParams) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const where = and(
    eq(romTable.userId, currentUser.id),
    eq(romTable.fileName, params.fileName),
    eq(romTable.platform, params.platform),
    eq(romTable.status, 1),
  )
  const [countResult] = await library.select({ count: count() }).from(romTable).where(where)

  const { launchbox, libretro } = params.gameInfo
  const value: InferInsertModel<typeof romTable> = {
    fileId: params.fileId,
    fileName: params.fileName,
    gameDeveloper: launchbox?.developer || libretro?.developer,
    gameName: launchbox?.name || libretro?.name,
    gamePublisher: launchbox?.publisher || libretro?.publisher,
    gameReleaseYear:
      Number.parseInt(launchbox?.releaseYear || '', 10) ||
      launchbox?.releaseDate?.getFullYear() ||
      libretro?.releaseyear,
    launchboxGameId: launchbox?.databaseId,
    libretroGameId: libretro?.id,
    platform: params.platform,
    userId: currentUser.id,
  }

  if (countResult.count) {
    const [result] = await library.update(romTable).set(value).where(where).returning()
    return result
  }

  const [result] = await library.insert(romTable).values(value).returning()
  return result
}

export async function createRoms({ files, platform }: { files: File[]; platform: string }) {
  const { storage } = getContext().var

  const roms = await Promise.all(
    files.map(async (file) => {
      const gameInfo = await guessGameInfo(file.name, platform)
      const fileId = nanoid()
      await storage.put(fileId, file)
      const rom = await createRom({
        fileId,
        fileName: file.name,
        gameInfo,
        platform,
      })
      return rom
    }),
  )

  return roms
}
