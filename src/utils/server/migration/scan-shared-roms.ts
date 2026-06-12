import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { and, eq, type InferInsertModel, inArray, isNull } from 'drizzle-orm'
import { attemptAsync } from 'es-toolkit'
import fs from 'fs-extra'
import { getDirectories } from '#@/constants/env.ts'
import { platformMap, type PlatformName } from '#@/constants/platform.ts'
import { romTable, statusEnum } from '#@/databases/schema.ts'
import { createDrizzle } from '../drizzle.ts'
import { extractRomMetadata, normalizeGameInfo } from '../rom-metadata.ts'
import { buildSharedRomFileId, isSharedLibraryEnabled, resolveSharedRomPath, SHARED_LIBRARY_USER_ID } from '../shared-rom.ts'

// Compute md5 for files below this size only; larger ROMs are identified by file name alone so a
// huge library never blocks on hashing. msleuth still matches many titles by name.
const MAX_MD5_FILE_SIZE = 64 * 1024 * 1024
// Bound the background enrichment pass so it never runs forever on a large, freshly-mounted library.
const ENRICH_TIME_BUDGET_MS = 2 * 60 * 1000
const ENRICH_CONCURRENCY = 4
const DB_CHUNK_SIZE = 500

// Metadata columns cleared when a soft-deleted shared ROM row is revived, since the same relative
// path may now point at a different ROM. `rawGameMetadata` doubles as the "enrichment attempted"
// marker: a non-null value means metadata has been looked up (matched, partially matched, or not).
const RESET_METADATA = {
  gameBoxartFileIds: null,
  gameDescription: null,
  gameDeveloper: null,
  gameGenres: null,
  gameName: null,
  gamePlayers: null,
  gamePublisher: null,
  gameRating: null,
  gameReleaseDate: null,
  gameReleaseYear: null,
  gameThumbnailFileIds: null,
  launchboxGameId: null,
  libretroGameId: null,
  rawGameMetadata: null,
} as const

interface DiscoveredRom {
  fileId: string
  fileName: string
  platform: PlatformName
}

/** Recursively list files under a platform directory, returning POSIX paths relative to it. Skips symlinks. */
async function listPlatformFiles(platformDirectory: string) {
  const relativePaths: string[] = []

  async function walk(directory: string, prefix: string) {
    const [, entries] = await attemptAsync(() => fs.readdir(directory, { withFileTypes: true }))
    if (!entries) {
      return
    }
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        await walk(path.join(directory, entry.name), relative)
      } else if (entry.isFile()) {
        relativePaths.push(relative)
      }
      // Symlinks report neither isFile() nor isDirectory() here, so they are intentionally skipped.
    }
  }

  await walk(platformDirectory, '')
  return relativePaths
}

/** True when the shared ROM directory exists and contains at least one recognized platform folder. */
export async function sharedRomDirectoryHasPlatform() {
  const { sharedRomDirectory } = getDirectories()
  if (!sharedRomDirectory || !(await fs.pathExists(sharedRomDirectory))) {
    return false
  }
  const [, entries] = await attemptAsync(() => fs.readdir(sharedRomDirectory, { withFileTypes: true }))
  return Boolean(entries?.some((entry) => entry.isDirectory() && Object.hasOwn(platformMap, entry.name.toLowerCase())))
}

async function discoverSharedRoms(sharedRomDirectory: string) {
  const discovered = new Map<string, DiscoveredRom>()

  // Match platform folder names case-insensitively (NES / Nes / nes) so the same layout works on
  // case-sensitive (Linux/Docker) and case-insensitive (Windows/macOS) filesystems alike.
  const [, entries] = await attemptAsync(() => fs.readdir(sharedRomDirectory, { withFileTypes: true }))
  if (!entries) {
    return discovered
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }
    const platform = entry.name.toLowerCase()
    if (!Object.hasOwn(platformMap, platform)) {
      continue
    }

    const extensions = new Set(
      platformMap[platform as PlatformName].fileExtensions.map((extension) => extension.toLowerCase()),
    )
    const relativePaths = await listPlatformFiles(path.join(sharedRomDirectory, entry.name))
    for (const relativePath of relativePaths) {
      if (!extensions.has(path.extname(relativePath).toLowerCase())) {
        continue
      }
      // Keep the actual on-disk folder name in the fileId so it resolves on case-sensitive
      // filesystems; the platform column uses the canonical lowercase key the rest of the app expects.
      const fileId = buildSharedRomFileId(entry.name, relativePath)
      discovered.set(fileId, { fileId, fileName: path.basename(relativePath), platform: platform as PlatformName })
    }
  }

  return discovered
}

/**
 * Phase 1 — fast, metadata-free, idempotent. Walk the shared ROM directory and reconcile the
 * `romTable` rows owned by the shared sentinel user: insert new files, revive previously-removed
 * ones, and soft-delete rows whose files are gone. Never reads file contents and never writes to
 * the shared directory, so it is cheap even for large libraries and safe on read-only mounts.
 */
export async function scanSharedRoms() {
  if (!isSharedLibraryEnabled()) {
    return
  }

  const { sharedRomDirectory } = getDirectories()
  if (!sharedRomDirectory || !(await fs.pathExists(sharedRomDirectory))) {
    console.warn(`Shared ROM directory "${sharedRomDirectory}" does not exist; skipping shared ROM scan.`)
    return
  }

  const { library } = createDrizzle()
  const discovered = await discoverSharedRoms(sharedRomDirectory)

  const existingRows = await library
    .select({ fileId: romTable.fileId, id: romTable.id, status: romTable.status })
    .from(romTable)
    .where(eq(romTable.userId, SHARED_LIBRARY_USER_ID))
  const existingByFileId = new Map(existingRows.map((row) => [row.fileId, row]))

  const toInsert: InferInsertModel<typeof romTable>[] = []
  const toRevive: string[] = []
  for (const rom of discovered.values()) {
    const existing = existingByFileId.get(rom.fileId)
    if (!existing) {
      toInsert.push({
        fileId: rom.fileId,
        fileName: rom.fileName,
        platform: rom.platform,
        userId: SHARED_LIBRARY_USER_ID,
      })
    } else if (existing.status !== statusEnum.normal) {
      toRevive.push(existing.id)
    }
  }

  const toSoftDelete = existingRows
    .filter((row) => row.status === statusEnum.normal && !discovered.has(row.fileId))
    .map((row) => row.id)

  await inChunks(toInsert, (chunk) => library.insert(romTable).values(chunk))
  // Reset metadata on revive: the same path may now hold a different ROM, so clear identification
  // (rawGameMetadata is the "enrichment attempted" marker) to force a fresh metadata lookup.
  await inChunks(toRevive, (chunk) =>
    library.update(romTable).set({ status: statusEnum.normal, ...RESET_METADATA }).where(inArray(romTable.id, chunk)),
  )
  await inChunks(toSoftDelete, (chunk) =>
    library.update(romTable).set({ status: statusEnum.deleted }).where(inArray(romTable.id, chunk)),
  )

  return { discovered: discovered.size, inserted: toInsert.length, removed: toSoftDelete.length, revived: toRevive.length }
}

/** Run an async DB operation over an array in DB_CHUNK_SIZE-sized slices, sequentially. */
async function inChunks<T>(items: T[], run: (chunk: T[]) => Promise<unknown>) {
  for (let index = 0; index < items.length; index += DB_CHUNK_SIZE) {
    await run(items.slice(index, index + DB_CHUNK_SIZE))
  }
}

async function computeMd5(filePath: string) {
  const [, stat] = await attemptAsync(() => fs.stat(filePath))
  if (!stat || stat.size > MAX_MD5_FILE_SIZE) {
    return ''
  }
  return new Promise<string>((resolve) => {
    const hash = createHash('md5')
    const stream = createReadStream(filePath)
    stream.on('error', () => resolve(''))
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

async function enrichOne(
  library: ReturnType<typeof createDrizzle>['library'],
  row: { fileId: string; fileName: string; id: string; platform: PlatformName },
) {
  // Resolve through the traversal/symlink-safe helper rather than joining the path by hand, so a
  // tampered fileId in the database can never make enrichment read outside the shared directory.
  const [, filePath] = await attemptAsync(() => resolveSharedRomPath(row.fileId))
  if (!filePath) {
    return
  }
  const md5 = await computeMd5(filePath)

  // Imported lazily so Phase 1 (and tests that only exercise scanning/storage) never load msleuth.
  const { msleuth } = await import('../msleuth.ts')
  const [, gameInfoList] = await attemptAsync(() =>
    msleuth.identify({ files: [{ md5, name: row.fileName }], platform: row.platform }),
  )
  const gameInfo = gameInfoList?.[0]
  const metadata = gameInfo ? extractRomMetadata(normalizeGameInfo(gameInfo)) : {}
  // Always stamp rawGameMetadata so an unmatched or partially-matched ROM is marked "attempted" and
  // is not re-hashed + re-queried on every subsequent scan (the selection filter checks it).
  await library
    .update(romTable)
    .set({ ...metadata, rawGameMetadata: metadata.rawGameMetadata ?? {} })
    .where(eq(romTable.id, row.id))
}

/**
 * Phase 2 — best-effort metadata enrichment for shared ROMs that still lack it. Runs in the
 * background (must be invoked without awaiting), concurrency-limited and time-boxed so it never
 * blocks startup. Idempotent: only rows still missing identifiers are processed, so it resumes
 * across restarts.
 */
export async function enrichSharedRomsMetadata() {
  if (!isSharedLibraryEnabled() || enrichInProgress) {
    return
  }
  enrichInProgress = true
  try {
    await runEnrichSharedRomsMetadata()
  } finally {
    enrichInProgress = false
  }
}

// Serializes every enrichment caller (the un-awaited startup pass and the periodic timer), so they
// never run the same msleuth lookups + DB writes concurrently.
let enrichInProgress = false

async function runEnrichSharedRomsMetadata() {
  const { library } = createDrizzle()
  const rows = await library
    .select({ fileId: romTable.fileId, fileName: romTable.fileName, id: romTable.id, platform: romTable.platform })
    .from(romTable)
    .where(
      // Only rows whose metadata has never been looked up. enrichOne always stamps rawGameMetadata
      // (even on a miss), so each row is enriched at most once — no perpetual re-hashing/re-querying.
      and(
        eq(romTable.userId, SHARED_LIBRARY_USER_ID),
        eq(romTable.status, statusEnum.normal),
        isNull(romTable.rawGameMetadata),
      ),
    )

  const deadline = Date.now() + ENRICH_TIME_BUDGET_MS
  let cursor = 0
  async function worker() {
    while (cursor < rows.length && Date.now() < deadline) {
      const row = rows[cursor]
      cursor += 1
      await attemptAsync(() => enrichOne(library, row))
    }
  }

  await Promise.all(Array.from({ length: ENRICH_CONCURRENCY }, () => worker()))
}
