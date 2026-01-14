import { and, eq, isNull, or, sql } from 'drizzle-orm'
import { attemptAsync, chunk } from 'es-toolkit'
import { getRuntimeKey } from 'hono/adapter'
import { romTable } from '#@/databases/schema.ts'
import { createDrizzle } from '../drizzle.ts'
import { msleuth } from '../msleuth.ts'

interface MigrateRomMetadataOptions {
  library: any
  roms: { id: string; launchboxGameId: null | number; libretroGameId: null | string }[]
}

async function migrateRomMetadata({ library, roms }: MigrateRomMetadataOptions) {
  if (roms.length === 0) {
    return
  }

  console.info(`Starting metadata migration for ${roms.length} ROMs...`)

  // Process in batches of 100 to avoid overwhelming msleuth
  const batches = chunk(roms, 100)
  let totalSuccess = 0
  let totalSkipped = 0
  let totalFailed = 0

  for (const [batchIndex, batch] of batches.entries()) {
    console.info(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} ROMs)...`)

    // Prepare conditions for msleuth
    const conditions = batch.map(({ launchboxGameId, libretroGameId }) => ({
      launchboxId: launchboxGameId,
      libretroId: libretroGameId,
    }))

    // Fetch metadata from msleuth
    const [error, metadataList] = await attemptAsync(() => msleuth.query({ conditions }))

    if (error) {
      console.error(`Failed to fetch metadata for batch ${batchIndex + 1}:`, error)
      totalFailed += batch.length
      continue
    }

    if (!metadataList) {
      console.error(`No metadata returned for batch ${batchIndex + 1}`)
      totalFailed += batch.length
      continue
    }

    // Update database with cached metadata
    const updates = batch
      .map((rom, index) => ({
        id: rom.id,
        rawGameMetadata: metadataList[index] || {},
      }))
      .filter(Boolean)

    // Batch update in chunks of 100
    const updateChunks = chunk(updates, 100)
    for (const [chunkIndex, updateChunk] of updateChunks.entries()) {
      try {
        await Promise.all(
          updateChunk.map((update: any) =>
            library.update(romTable).set({ rawGameMetadata: update.rawGameMetadata }).where(eq(romTable.id, update.id)),
          ),
        )
        totalSuccess += updateChunk.length
      } catch (error) {
        console.error(`Failed to update metadata chunk ${chunkIndex + 1}:`, error)
        totalFailed += updateChunk.length
      }
    }

    totalSkipped += batch.length - updates.length
  }

  console.info('Metadata Migration Completed')
  console.info(`Successfully cached: ${totalSuccess} ROMs`)
  console.info(`Skipped (no metadata available): ${totalSkipped} ROMs`)
  console.info(`Failed: ${totalFailed} ROMs`)
}

async function main() {
  if (getRuntimeKey() !== 'node') {
    return
  }
  const { library } = createDrizzle()

  // Check if migration is needed - find ROMs with launchboxGameId or libretroGameId but no rawGameMetadata
  const romsNeedingMigration = await library
    .select({ id: romTable.id, launchboxGameId: romTable.launchboxGameId, libretroGameId: romTable.libretroGameId })
    .from(romTable)
    .where(
      and(
        eq(romTable.status, 1),
        or(
          isNull(romTable.rawGameMetadata),
          // SQLite doesn't have IS NULL for JSON, so we also check for empty string
          sql`(${romTable.rawGameMetadata} IS NULL OR ${romTable.rawGameMetadata} = '')`,
        ),
        or(sql`${romTable.launchboxGameId} IS NOT NULL`, sql`${romTable.libretroGameId} IS NOT NULL`),
      ),
    )

  if (romsNeedingMigration.length === 0) {
    return
  }

  console.info(`Found ${romsNeedingMigration.length} ROMs needing metadata migration...`)

  await migrateRomMetadata({ library, roms: romsNeedingMigration })
}

await main()
