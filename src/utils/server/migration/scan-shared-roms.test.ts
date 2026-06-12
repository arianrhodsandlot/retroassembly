import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, test } from 'node:test'

describe('scanSharedRoms integration', () => {
  let dataDir = ''
  let sharedDir = ''
  let scanSharedRoms: typeof import('./scan-shared-roms.ts').scanSharedRoms
  let createStorage: typeof import('../storage.ts').createStorage
  let createDrizzle: typeof import('../drizzle.ts').createDrizzle
  let romTable: typeof import('#@/databases/schema.ts').romTable
  let eq: typeof import('drizzle-orm').eq

  before(async () => {
    dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shared-rom-data-'))
    sharedDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shared-rom-mount-'))

    process.env.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY = dataDir
    process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY = sharedDir
    process.env.RETROASSEMBLY_RUN_TIME_ENABLE_SHARED_ROM_LIBRARY = 'true'

    // Write real-looking ROM files plus one with a wrong extension that must be ignored. The
    // uppercase SNES folder verifies platform folders are matched case-insensitively.
    await fs.mkdir(path.join(sharedDir, 'nes'), { recursive: true })
    await fs.mkdir(path.join(sharedDir, 'gba'), { recursive: true })
    await fs.mkdir(path.join(sharedDir, 'SNES'), { recursive: true })
    await fs.writeFile(path.join(sharedDir, 'nes', 'Test (USA).nes'), Buffer.from([0x4e, 0x45, 0x53, 0x1a, 0x01]))
    await fs.writeFile(path.join(sharedDir, 'gba', 'Demo.gba'), Buffer.from([0x00, 0x11, 0x22, 0x33]))
    await fs.writeFile(path.join(sharedDir, 'SNES', 'Hilda.sfc'), Buffer.from([0x00, 0x11]))
    await fs.writeFile(path.join(sharedDir, 'nes', 'notes.txt'), Buffer.from('ignore me'))

    // Import after env is set, then run the migrations the same way initalization.ts does.
    const drizzleModule = await import('../drizzle.ts')
    createDrizzle = drizzleModule.createDrizzle
    const schemaModule = await import('#@/databases/schema.ts')
    romTable = schemaModule.romTable
    const drizzleOrm = await import('drizzle-orm')
    eq = drizzleOrm.eq

    const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
    migrate(createDrizzle().library, {
      migrationsFolder: 'src/databases/migrations',
      migrationsSchema: 'src/databases/schema.ts',
    })

    const scanModule = await import('./scan-shared-roms.ts')
    scanSharedRoms = scanModule.scanSharedRoms
    const storageModule = await import('../storage.ts')
    createStorage = storageModule.createStorage
  })

  after(async () => {
    delete process.env.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
    delete process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY
    delete process.env.RETROASSEMBLY_RUN_TIME_ENABLE_SHARED_ROM_LIBRARY
    // Best-effort: the open better-sqlite3 handle keeps the db file locked on Windows, so ignore
    // cleanup failures. The OS reclaims the temp dirs regardless.
    for (const dir of [dataDir, sharedDir]) {
      if (dir) {
        try {
          await fs.rm(dir, { force: true, recursive: true })
        } catch {}
      }
    }
  })

  async function getSharedRows() {
    const { library } = createDrizzle()
    return library
      .select({ fileId: romTable.fileId, platform: romTable.platform, status: romTable.status, userId: romTable.userId })
      .from(romTable)
      .where(eq(romTable.userId, '__shared__'))
  }

  test('scans and inserts shared rom rows, ignoring wrong extensions', async () => {
    await scanSharedRoms()
    const rows = await getSharedRows()
    const fileIds = rows.map((row) => row.fileId)

    assert.equal(rows.every((row) => row.userId === '__shared__'), true)
    assert.equal(fileIds.includes('shared-roms/nes/Test (USA).nes'), true)
    assert.equal(fileIds.includes('shared-roms/gba/Demo.gba'), true)
    assert.equal(fileIds.some((fileId) => fileId.startsWith('shared-roms/nes/')), true)
    assert.equal(fileIds.some((fileId) => fileId.startsWith('shared-roms/gba/')), true)
    // The uppercase SNES folder is matched case-insensitively: the fileId keeps the on-disk case,
    // while the platform column is the canonical lowercase key.
    const snesRow = rows.find((row) => row.fileId === 'shared-roms/SNES/Hilda.sfc')
    assert.ok(snesRow)
    assert.equal(snesRow.platform, 'snes')
    // The wrong-extension file must not be inserted.
    assert.equal(fileIds.some((fileId) => fileId.endsWith('notes.txt')), false)
    assert.equal(rows.length, 3)
  })

  test('sharedRomDirectoryHasPlatform detects recognized platform folders', async () => {
    const { sharedRomDirectoryHasPlatform } = await import('./scan-shared-roms.ts')
    assert.equal(await sharedRomDirectoryHasPlatform(), true)
  })

  test('is idempotent: a second scan does not create duplicates', async () => {
    const before = await getSharedRows()
    await scanSharedRoms()
    const after = await getSharedRows()
    assert.equal(after.length, before.length)
    assert.equal(after.length, 3)
  })

  test('storage.get returns the bytes from the mounted file', async () => {
    const storage = createStorage()
    const result = await storage.get('shared-roms/nes/Test (USA).nes')
    const onDisk = await fs.readFile(path.join(sharedDir, 'nes', 'Test (USA).nes'))
    assert.deepEqual(Buffer.from(result.body), onDisk)
  })

  test('storage.delete is a no-op for shared rom files', async () => {
    const storage = createStorage()
    const filePath = path.join(sharedDir, 'nes', 'Test (USA).nes')
    await storage.delete('shared-roms/nes/Test (USA).nes')
    await assert.doesNotReject(fs.access(filePath))
  })

  test('storage.put rejects for shared rom files', async () => {
    const storage = createStorage()
    const blob = new Blob([Buffer.from([0x00])])
    await assert.rejects(storage.put('shared-roms/nes/x.nes', blob))
  })
})
