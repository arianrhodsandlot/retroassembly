/* eslint-disable sonarjs/hashing */
import { createHash } from 'node:crypto'
import { glob, readFile, stat, watch } from 'node:fs/promises'
import path from 'node:path'
import { BlobReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js'
import { DateTime } from 'luxon'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { platforms } from '#@/constants/platform.ts'
import { romTable } from '#@/databases/schema.ts'
import { createDrizzle } from '#@/utils/server/drizzle.ts'
import { msleuth } from '#@/utils/server/msleuth.ts'

const knownRomExtensions = new Set(platforms.flatMap(({ fileExtensions }) => fileExtensions))

function getRomsDirectory() {
  const runTimeEnv = getRunTimeEnv()
  const directory = runTimeEnv.RETROASSEMBLY_RUN_TIME_ROMS_DIRECTORY
  return directory
}

async function extract(filePath: string) {
  const buffer = await readFile(filePath)
  const blob = new Blob([buffer])
  const zipReader = new ZipReader(new BlobReader(blob))
  const entries = await zipReader.getEntries()
  const files = entries.filter((entry) => !entry.directory)
  const data = await Promise.all(files.map((entry) => entry.getData(new Uint8ArrayWriter())))
  await zipReader.close()
  return data
}

async function getMd5(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.zip') {
    const entries = await extract(filePath)
    if (entries.length === 1) {
      const data = entries[0]
      return createHash('md5').update(data).digest('hex')
    }
  }
  const data = await readFile(filePath)
  return createHash('md5').update(data).digest('hex')
}

async function listen() {
  const directory = getRomsDirectory()
  if (!directory) {
    return
  }

  const events = watch(directory, { recursive: true })
  for await (const event of events) {
    console.info(event)
  }
}

async function mayBeRomFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  if (!knownRomExtensions.has(ext)) {
    return false
  }

  const fileStat = await stat(filePath)
  if (!fileStat.isFile()) {
    return false
  }

  const maxFileSize = 150 * 1024 * 1024
  if (fileStat.size > maxFileSize) {
    return false
  }

  return true
}

function getReleaseDate({ launchbox }) {
  if (launchbox?.releaseDate) {
    const date = DateTime.fromISO(launchbox.releaseDate)
    if (date.isValid) {
      return date.toJSDate()
    }
  }
}

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

export async function scanRoms() {
  const { library } = createDrizzle()
  const directory = getRomsDirectory()

  const chunkSize = 100
  const files: { fileId: string; md5: string; name: string }[] = []

  async function createRoms() {
    const metadataList = await msleuth.identify({
      files: files.map(({ md5, name }) => ({ md5, name })),
      platform: 'nes',
    })
    console.info(metadataList)
    const rows = files.map((file, i) => {
      const metadata = metadataList?.[i]
      const launchbox = metadata?.launchbox
      const libretro = metadata?.libretro
      return {
        ...file,
        fileName: file.name,
        gameDeveloper: launchbox?.developer || libretro?.developer,
        gameGenres: getGenres({ launchbox, libretro }),
        gameName: launchbox?.name || libretro?.name,
        gamePlayers: launchbox?.maxPlayers || libretro?.users,
        gamePublisher: launchbox?.publisher || libretro?.publisher,
        gameRating: launchbox?.communityRating,
        gameReleaseDate: getReleaseDate({ launchbox }),
        launchboxGameId: launchbox?.databaseId,
        libretroGameId: libretro?.id,
        platform: 'nes' as const,
        userId: 'system',
      }
    })
    await library.insert(romTable).values(rows).returning()
  }

  for await (const entry of glob(`${directory}/**/*`)) {
    if (!(await mayBeRomFile(entry))) {
      continue
    }

    const fileId = path.relative(directory, entry)
    const name = path.basename(entry)
    const md5 = await getMd5(entry)
    files.push({ fileId, md5, name })

    if (files.length === chunkSize) {
      await createRoms()
      files.length = 0
    }
  }
  if (files.length > 0) {
    await createRoms()
  }
}

async function main() {
  await scanRoms()
  // await listen()
}

await main()
