import path from 'node:path'
import { and, eq, inArray, type InferInsertModel } from 'drizzle-orm'
import { chunk, omit } from 'es-toolkit'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { DateTime } from 'luxon'
import type { QueryResponse } from 'msleuth/client'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { platformMap, type PlatformName } from '#@/constants/platform.ts'
import { romTable } from '#@/databases/schema.ts'
import { getFilePartialDigest } from '#@/utils/server/file.ts'
import { msleuth } from '#@/utils/server/msleuth.ts'
import { countRoms } from './count-roms.ts'

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

async function prepareRomData(files: File[], gameInfoList: QueryResponse | undefined, platform: PlatformName) {
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
      const gameInfo = gameInfoList?.[index] || {}
      const { launchbox, libretro } = gameInfo
      const romData: InferInsertModel<typeof romTable> = {
        fileId,
        fileName: file.name,
        gameDeveloper: launchbox?.developer || libretro?.developer,
        gameGenres: getGenres({ launchbox, libretro }),
        gameName: launchbox?.name || libretro?.name,
        gamePlayers: launchbox?.maxPlayers || libretro?.users,
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

async function findExistingRoms(files: File[], platform: PlatformName) {
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
          const updateData = omit(data, ['id'])
          const result = await library.update(romTable).set(updateData).where(eq(romTable.id, rom.id)).returning()
          return result[0]
        }),
      )
      results.push(...updateResults)
    }
  }

  return results
}

export async function createRoms({ files, md5s, platform }: { files: File[]; md5s: string[]; platform: PlatformName }) {
  const runtimeEnv = getRunTimeEnv()
  const { t } = getContext().var
  const maxRomCount = Number.parseInt(runtimeEnv.RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT, 10) || Infinity
  const romCount = await countRoms()
  if (romCount + files.length > maxRomCount) {
    throw new HTTPException(400, {
      message: t('Adding these ROMs would exceed the maximum allowed ROM count of {{maxRomCount}}.', { maxRomCount }),
    })
  }

  for (const file of files) {
    const ext = path.parse(file.name).ext.toLowerCase()
    if (!platformMap[platform].fileExtensions.includes(ext)) {
      throw new HTTPException(400, {
        message: `File extension ${ext} is not supported for platform ${platform}`,
      })
    }
  }
  let gameInfoList: Awaited<ReturnType<typeof msleuth.identify>> = []
  try {
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
