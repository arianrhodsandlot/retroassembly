import crypto from 'node:crypto'
import path from 'node:path'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { camelCase, chunk, mapKeys } from 'es-toolkit'
import { Libretrodb } from 'libretrodb'
import { fs } from 'zx'
import { libretroGameTable } from '../../databases/metadata/schema.ts'
import { parse } from '../../utils/goodcodes-parser.ts'

const nonSupportedPlatforms = new Set([
  'Commodore - Amiga',
  'DOS',
  'Microsoft - Xbox',
  'Mobile - J2ME',
  'Nintendo - GameCube',
  'Nintendo - Wii',
  'Nintendo - Wii (Digital)',
  'RPG Maker',
  'Sega - Dreamcast',
  'Sega - Naomi',
  'Sega - Naomi 2',
  'Sega - Saturn',
  'Sinclair - ZX Spectrum',
  'Sony - PlayStation 2',
  'Sony - PlayStation 3',
  'Sony - PlayStation 3 (PSN)',
  'Sony - PlayStation Portable',
  'Sony - PlayStation Portable (PSN)',
  'Sony - PlayStation Vita',
  'WASM-4',
])

function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}

async function extractLibretroDb(rdbPath: string, db: BetterSQLite3Database) {
  const platform = path.parse(rdbPath).name
  const libretrodb = await Libretrodb.from(rdbPath, { indexHashes: false })
  const entries = libretrodb.getEntries()

  for (const recordsChunk of chunk(entries, 1000)) {
    const values = recordsChunk
      .filter(({ name }) => name)
      .map((record) => ({
        ...mapKeys(record, (_value, key) => camelCase(`${key}`)),
        compactName: getCompactName(`${record.name}`),
        goodcodesBaseCompactName: getCompactName(parse(`0 - ${record.name}`).rom),
        id: crypto.hash('sha1', JSON.stringify({ ...record, platform })),
        platform,
      }))
    if (values.length > 0) {
      await db.insert(libretroGameTable).values(values).onConflictDoNothing()
    }
  }
}

async function extractLibretroDbs() {
  const db = drizzle({
    casing: 'snake_case',
    connection: path.resolve(import.meta.dirname, '../artifacts/metadata.db'),
  })
  const libretroDbDirectory = path.resolve(import.meta.dirname, '../inputs/libretro/database-rdb/')
  const rdbs = await fs.readdir(libretroDbDirectory)
  const rdbPaths = rdbs.map((rdb) => path.resolve(libretroDbDirectory, rdb))
  for (const rdbPath of rdbPaths) {
    const platform = path.parse(rdbPath).name
    if (!nonSupportedPlatforms.has(platform)) {
      extractLibretroDb(rdbPath, db)
    }
  }
}

await extractLibretroDbs()
