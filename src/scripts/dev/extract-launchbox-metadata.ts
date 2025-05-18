import { createReadStream } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { camelCase, chunk, noop } from 'es-toolkit'
import sax from 'sax'
import {
  launchboxGameAlternateNameTable,
  launchboxGameTable,
  launchboxPlatformAlternateNameTable,
  launchboxPlatformTable,
} from '../../databases/metadata/schema.ts'
import { parse } from '../../utils/goodcodes-parser.ts'

const xmlPath = path.resolve(import.meta.dirname, '../inputs/launchbox/metadata/Metadata.xml')

type Records = Record<string, string>[]

const nonSupportedPlatforms = new Set([
  'Android',
  'Apple II',
  'Apple iOS',
  'Apple Mac OS',
  'Commodore 64',
  'Commodore Amiga',
  'Microsoft Xbox',
  'Microsoft Xbox 360',
  'Microsoft Xbox One',
  'Microsoft Xbox Series X/S',
  'MS-DOS',
  'Nintendo 3DS',
  'Nintendo GameCube',
  'Nintendo Switch',
  'Nintendo Wii',
  'Nintendo Wii U',
  'Ouya',
  'Pinball',
  'Sega Dreamcast',
  'Sega Saturn',
  'Sinclair ZX Spectrum',
  'Sony Playstation 2',
  'Sony Playstation 3',
  'Sony Playstation 4',
  'Sony Playstation 5',
  'Sony Playstation Vita',
  'Sony PSP',
  'Sony PSP Minis',
  'Web Browser',
  'Windows',
  'Windows 3.X',
])
function isSupportedPlatform(platform: string) {
  return !nonSupportedPlatforms.has(platform)
}

function parseMetadata(filePath: string) {
  const { promise, resolve } = Promise.withResolvers<Record<string, Records>>()

  const recordsMap: Record<string, Record<string, string>[]> = {
    Game: [],
    GameAlternateName: [],
    Platform: [],
    PlatformAlternateName: [],
  }
  let record: Record<string, string> = {}
  let field = ''

  const openingTags: string[] = []
  let isRecording = false

  const saxStream = sax
    .createStream(true, { trim: true })
    .on('opentag', (tag) => {
      openingTags.push(tag.name)
      field = camelCase(tag.name)
      isRecording = openingTags.length > 2 && openingTags[1] in recordsMap
    })
    .on('text', (text) => {
      if (isRecording && field) {
        record[field] ||= ''
        record[field] += text
      }
    })
    .on('closetag', () => {
      const openingTag = openingTags.pop()

      if (openingTags.length === 1) {
        if (openingTag && openingTag in recordsMap) {
          if (openingTag === 'Game') {
            if (isSupportedPlatform(record.platform)) {
              recordsMap[openingTag].push(record)
            }
          } else {
            recordsMap[openingTag].push(record)
          }
        }
        record = {}
        field = ''
      }

      if (openingTags.length === 0) {
        resolve(recordsMap)
      }
    })
    .on('error', noop)

  createReadStream(filePath).pipe(saxStream)

  return promise
}

function castBoolean(value: string) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
}

function castInteger(value) {
  try {
    return Number.parseInt(value, 10) || null
  } catch {}
}

function castDecimal(value) {
  try {
    return Number.parseFloat(value) || null
  } catch {}
}

function castDate(value) {
  try {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  } catch {}
}

function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}

async function writeLaunchboxPlatform(records: Records, db: BetterSQLite3Database) {
  await db
    .insert(launchboxPlatformTable)
    .values(
      records.map((record) => ({
        ...record,
        emulated: castBoolean(record.emulated),
        name: record.name,
        releaseDate: castDate(record.releaseDate),
        useMameFiles: castBoolean(record.useMameFiles),
      })),
    )
    .onConflictDoNothing()
}

async function writeLaunchboxPlatformAlternateName(records: Records, db: BetterSQLite3Database) {
  await db.insert(launchboxPlatformAlternateNameTable).values(
    records.map((record) => ({
      ...record,
      alternate: record.alternate,
    })),
  )
}

async function writeLaunchboxGameAlternateName(records: Records, db: BetterSQLite3Database) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGameAlternateNameTable).values(
      recordsChunk
        .filter((record) => record.alternateName && getCompactName(record.alternateName))
        .map((record) => ({
          ...record,
          compactName: getCompactName(record.alternateName),
          databaseId: castInteger(record.databaseId),
        })),
    )
  }
}

async function writeLaunchboxGame(records: Records, db: BetterSQLite3Database) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGameTable).values(
      recordsChunk.map((record) => ({
        ...record,
        communityRating: castDecimal(record.communityRating),
        communityRatingCount: castInteger(record.communityRatingCount),
        compactName: getCompactName(record.name),
        cooperative: castBoolean(record.cooperative),
        databaseId: castInteger(record.databaseId) as number,
        goodcodesBaseCompactName: getCompactName(parse(`0 - ${record.name}`).rom),
        maxPlayers: castInteger(record.maxPlayers),
        name: record.name,
        releaseDate: castDate(record.releaseDate),
      })),
    )
  }
}

const loadMetadataFromCache = true
const cachePathMap = {
  Game: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-game.json'),
  GameAlternateName: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-game-alternate-names.json'),
  Platform: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-platforms.json'),
  PlatformAlternateName: path.resolve(
    import.meta.dirname,
    '../artifacts/launchbox-metadata-platform-alternate-names.json',
  ),
}

async function getMetadata() {
  if (loadMetadataFromCache) {
    try {
      const metadata: Record<string, Records> = {}
      metadata.Game = JSON.parse(await readFile(cachePathMap.Game, 'utf8'))
      metadata.Platform = JSON.parse(await readFile(cachePathMap.Platform, 'utf8'))
      metadata.PlatformAlternateName = JSON.parse(await readFile(cachePathMap.PlatformAlternateName, 'utf8'))
      metadata.GameAlternateName = JSON.parse(await readFile(cachePathMap.GameAlternateName, 'utf8'))
      return metadata
    } catch {}
  }
  const metadata = await parseMetadata(xmlPath)

  const gameIdMap = new Map<string, boolean>()
  for (const game of metadata.Game) {
    gameIdMap.set(game.databaseId, true)
  }
  metadata.GameAlternateName = metadata.GameAlternateName.filter((alternate) => gameIdMap.has(alternate.databaseId))

  await Promise.all([
    writeFile(path.resolve(cachePathMap.Game), JSON.stringify(metadata.Game), 'utf8'),
    writeFile(path.resolve(cachePathMap.Platform), JSON.stringify(metadata.Platform), 'utf8'),
    writeFile(path.resolve(cachePathMap.PlatformAlternateName), JSON.stringify(metadata.PlatformAlternateName), 'utf8'),
    writeFile(path.resolve(cachePathMap.GameAlternateName), JSON.stringify(metadata.GameAlternateName), 'utf8'),
  ])
  return metadata
}

async function extractLaunchboxMetadata() {
  const metadata = await getMetadata()

  const db = drizzle({
    casing: 'snake_case',
    connection: path.resolve(import.meta.dirname, '../artifacts/metadata.db'),
  })

  console.info('writing metadata.Platform...')
  await writeLaunchboxPlatform(metadata.Platform, db)

  console.info('writing metadata.PlatformAlternateName...')
  await writeLaunchboxPlatformAlternateName(metadata.PlatformAlternateName, db)

  console.info('writing metadata.GameAlternateName...')
  await writeLaunchboxGameAlternateName(metadata.GameAlternateName, db)

  console.info('writing metadata.Game...')
  await writeLaunchboxGame(metadata.Game, db)
}

await extractLaunchboxMetadata()
