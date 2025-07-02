import { and, eq, inArray, type InferInsertModel } from 'drizzle-orm'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import ky from 'ky'
import type { GameInfo } from '../controllers/guess-game-info.ts'
import { romTable } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'

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
    const url = new URL('/api/v1/sleuth', MSLEUTH_HOST as string)
    const response = await ky(url, { searchParams }).json()
    return Array.isArray(response) ? (response as GameInfo[]) : []
  } catch {
    return []
  }
}

async function prepareRomData(files: File[], gameInfoList: GameInfo[], platform: string) {
  const { currentUser, storage } = getContext().var

  return await Promise.all(
    files.map(async (file, index) => {
      const fileId = nanoid()
      await storage.put(fileId, file)

      const gameInfo = gameInfoList[index] || {}
      const { launchbox, libretro } = gameInfo
      const romData: InferInsertModel<typeof romTable> = {
        fileId,
        fileName: file.name,
        gameDeveloper: launchbox?.developer || libretro?.developer,
        gameName: launchbox?.name || libretro?.name,
        gamePublisher: launchbox?.publisher || libretro?.publisher,
        gameReleaseYear: getReleaseYear({ launchbox, libretro }),
        launchboxGameId: launchbox?.databaseId,
        libretroGameId: libretro?.id,
        platform,
        userId: currentUser.id,
      }

      return romData
    }),
  )
}

async function findExistingRoms(files: File[], platform: string) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const fileNames = files.map((file) => file.name)
  const existingRomsArray = await library
    .select()
    .from(romTable)
    .where(
      and(
        eq(romTable.userId, currentUser.id),
        eq(romTable.platform, platform),
        eq(romTable.status, 1),
        inArray(romTable.fileName, fileNames),
      ),
    )

  // Create a map for O(1) lookup by fileName
  const existingRomsMap = new Map(existingRomsArray.map((rom) => [rom.fileName, rom]))

  // Match existing ROMs to their original file order
  return files.map((file) => existingRomsMap.get(file.name) || null)
}

function separateUpdatesAndInserts(romDataList: InferInsertModel<typeof romTable>[], existingRoms: (any | null)[]) {
  const updates: { data: InferInsertModel<typeof romTable>; rom: any }[] = []
  const inserts: InferInsertModel<typeof romTable>[] = []

  for (const [index, romData] of romDataList.entries()) {
    const existingRom = existingRoms[index]
    if (existingRom) {
      updates.push({ data: romData, rom: existingRom })
    } else {
      inserts.push(romData)
    }
  }

  return { inserts, updates }
}

async function performBatchOperations(
  updates: { data: InferInsertModel<typeof romTable>; rom: any }[],
  inserts: InferInsertModel<typeof romTable>[],
) {
  const { db } = getContext().var
  const { library } = db

  const results: any[] = []

  // Perform batch insert for new ROMs (these get new IDs as expected)
  if (inserts.length > 0) {
    const insertResults = await library.insert(romTable).values(inserts).returning()
    results.push(...insertResults)
  }

  // Perform updates in parallel to preserve existing IDs
  if (updates.length > 0) {
    const updateResults = await Promise.all(
      updates.map(async ({ data, rom }) => {
        // Remove the id from data to avoid trying to update the primary key
        const { id, ...updateData } = data
        const result = await library.update(romTable).set(updateData).where(eq(romTable.id, rom.id)).returning()
        return result[0]
      }),
    )
    results.push(...updateResults)
  }

  return results
}

export async function createRoms({ files, md5s, platform }: { files: File[]; md5s: string[]; platform: string }) {
  // Get game information for all files
  const gameInfoList = await getGameInfoList({ files, md5s, platform })

  // Prepare ROM data with file uploads
  const romDataList = await prepareRomData(files, gameInfoList, platform)

  // Find existing ROMs in database
  const existingRoms = await findExistingRoms(files, platform)

  // Separate operations into updates and inserts
  const { inserts, updates } = separateUpdatesAndInserts(romDataList, existingRoms)

  // Perform batch database operations
  return performBatchOperations(updates, inserts)
}
