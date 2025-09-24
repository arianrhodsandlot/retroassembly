import { subtle } from 'node:crypto'
import path from 'node:path'
import { and, eq, inArray, type InferInsertModel } from 'drizzle-orm'
import { chunk } from 'es-toolkit'
import { getContext } from 'hono/context-storage'
import { DateTime } from 'luxon'
import { romTable } from '@/databases/schema.ts'
import { msleuth } from '@/utils/server/msleuth.ts'

function getGenres({ launchbox, libretro }) {
  return (
    launchbox?.genres
      ?.split(';')
      .map((genre) => genre.trim())
      .join(',') ||
    libretro?.genres
      ?.split(',')
      .map((genre) => genre.trim())
      .join(',')
  )
}

function getReleaseDate({ launchbox }) {
  if (launchbox?.releaseDate) {
    const date = DateTime.fromISO(launchbox.releaseDate)
    if (date.isValid) {
      return date.toJSDate()
    }
  }
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

async function getFilePartialDigest(file: File) {
  const header = await file.slice(0, 1024).arrayBuffer()
  const footer = await file.slice(-1024).arrayBuffer()
  const data = new Uint8Array(header.byteLength + footer.byteLength + 8)
  data.set(new Uint8Array(header), 0)
  data.set(new Uint8Array(footer), header.byteLength)
  new DataView(data.buffer).setBigUint64(header.byteLength + footer.byteLength, BigInt(file.size), true)
  const hash = await subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}

async function prepareRomData(files: File[], gameInfoList: any[], platform: string) {
  const { currentUser, storage } = getContext().var

  return await Promise.all(
    files.map(async (file, index) => {
      const { ext } = path.parse(file.name)
      const digest = await getFilePartialDigest(file)
      const fileId = path.join('roms', platform, `${digest}${ext}`)
      const fileExists = await storage.head(fileId)
      if (!fileExists) {
        await storage.put(fileId, file)
      }
      const gameInfo = gameInfoList[index] || {}
      const { launchbox, libretro } = gameInfo
      const romData: InferInsertModel<typeof romTable> = {
        fileId,
        fileName: file.name,
        gameDeveloper: launchbox?.developer || libretro?.developer,
        gameGenres: getGenres({ launchbox, libretro }),
        gameName: launchbox?.name || libretro?.name,
        gamePlayers: launchbox?.players || libretro?.users,
        gamePublisher: launchbox?.publisher || libretro?.publisher,
        gameRating: launchbox?.communityRating,
        gameReleaseDate: getReleaseDate({ launchbox }),
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

  let existingRoms: any[] = []

  if (fileNames.length > 100) {
    const fileNameChunks = chunk(fileNames, 100)

    for (const fileNameChunk of fileNameChunks) {
      const chunkResults = await library
        .select()
        .from(romTable)
        .where(
          and(
            eq(romTable.userId, currentUser.id),
            eq(romTable.platform, platform),
            eq(romTable.status, 1),
            inArray(romTable.fileName, fileNameChunk),
          ),
        )
      existingRoms.push(...chunkResults)
    }
  } else {
    existingRoms = await library
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
  }

  // Create a map for O(1) lookup by fileName
  const existingRomsMap = new Map(existingRoms.map((rom) => [rom.fileName, rom]))

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

  const chunkSize = 5

  if (inserts.length > 0) {
    const insertChunks = chunk(inserts, chunkSize)

    for (const insertChunk of insertChunks) {
      const insertResults = await library.insert(romTable).values(insertChunk).returning()
      results.push(...insertResults)
    }
  }

  if (updates.length > 0) {
    const updateChunks = chunk(updates, chunkSize)

    for (const updateChunk of updateChunks) {
      const updateResults = await Promise.all(
        updateChunk.map(async ({ data, rom }) => {
          // Remove the id from data to avoid trying to update the primary key
          const { id, ...updateData } = data
          const result = await library.update(romTable).set(updateData).where(eq(romTable.id, rom.id)).returning()
          return result[0]
        }),
      )
      results.push(...updateResults)
    }
  }

  return results
}

export async function createRoms({ files, md5s, platform }: { files: File[]; md5s: string[]; platform: string }) {
  let gameInfoList = []
  try {
    // @ts-expect-error msleuth response is not typed
    gameInfoList = await msleuth.identify({
      files: files.map((file, index) => ({ md5: md5s[index], name: file.name })),
      platform,
    })
  } catch (error) {
    console.warn(error)
  }
  const romDataList = await prepareRomData(files, gameInfoList, platform)
  const existingRoms = await findExistingRoms(files, platform)
  const { inserts, updates } = separateUpdatesAndInserts(romDataList, existingRoms)
  return performBatchOperations(updates, inserts)
}
