import { and, count, eq, type InferInsertModel } from 'drizzle-orm'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import ky from 'ky'
import type { GameInfo } from '../controllers/guess-game-info.ts'
import { romTable } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  gameInfo: GameInfo
  platform: string
}

function getReleaseYear({ launchbox, libretro }) {
  if (launchbox) {
    if (launchbox.releaseYear) {
      const result = Number.parseInt(launchbox.releaseYear || '', 10)
      if (result) {
        return result
      }
    }

    if (launchbox.releaseDate) {
      const result = new Date(launchbox.releaseDate).getFullYear()
      if (result) {
        return result
      }
    }
  }

  if (libretro) {
    const result = Number.parseInt(libretro.releaseyear || '', 10)
    if (result) {
      return result
    }
  }
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
    gameReleaseYear: getReleaseYear({ launchbox, libretro }),
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

async function getGameInfoList({ files, md5s, platform }: { files: File[]; md5s: string[]; platform: string }) {
  const c = getContext()
  const { MSLEUTH_HOST } = env(c)

  if (!MSLEUTH_HOST) {
    return []
  }

  const searchParams = new URLSearchParams({
    files: JSON.stringify(files.map((file, index) => ({ md5: md5s[index], name: file.name }))),
    platform,
  })
  try {
    const gameInfoList = await ky(new URL('/api/v1/sleuth', MSLEUTH_HOST), { searchParams }).json()
    return gameInfoList
  } catch {
    return []
  }
}

export async function createRoms({ files, md5s, platform }: { files: File[]; md5s: string[]; platform: string }) {
  const { storage } = getContext().var
  const gameInfoList = await getGameInfoList({ files, md5s, platform })
  const roms = await Promise.all(
    files.map(async (file, index) => {
      const fileId = nanoid()
      await storage.put(fileId, file)
      const rom = await createRom({
        fileId,
        fileName: file.name,
        gameInfo: gameInfoList[index],
        platform,
      })
      return rom
    }),
  )

  return roms
}
