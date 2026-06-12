import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, test } from 'node:test'
import { buildSharedRomFileId, isSharedRomFileId, isSharedUserId, resolveSharedRomPath } from './shared-rom.ts'

describe('shared-rom pure helpers', () => {
  test('isSharedRomFileId', () => {
    assert.equal(isSharedRomFileId('shared-roms/nes/x.nes'), true)
    assert.equal(isSharedRomFileId('roms/nes/abc.nes'), false)
    assert.equal(isSharedRomFileId(undefined), false)
    assert.equal(isSharedRomFileId(null), false)
  })

  test('isSharedUserId', () => {
    assert.equal(isSharedUserId('__shared__'), true)
    assert.equal(isSharedUserId('someone'), false)
    assert.equal(isSharedUserId(undefined), false)
    assert.equal(isSharedUserId(null), false)
  })

  test('buildSharedRomFileId', () => {
    assert.equal(buildSharedRomFileId('nes', 'Super Mario Bros.nes'), 'shared-roms/nes/Super Mario Bros.nes')
  })
})

describe('resolveSharedRomPath', () => {
  let tempDir = ''
  const previous = process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY

  before(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shared-rom-unit-'))
    process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY = tempDir
    await fs.mkdir(path.join(tempDir, 'roms', 'nes'), { recursive: true })
    await fs.writeFile(path.join(tempDir, 'roms', 'nes', 'test.nes'), Buffer.from([0x4e, 0x45, 0x53, 0x1a]))
  })

  after(async () => {
    if (previous === undefined) {
      delete process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY
    } else {
      process.env.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY = previous
    }
    if (tempDir) {
      await fs.rm(tempDir, { force: true, recursive: true })
    }
  })

  test('resolves an existing file to an absolute path inside the temp dir', async () => {
    const resolved = await resolveSharedRomPath('shared-roms/roms/nes/test.nes')
    assert.equal(path.isAbsolute(resolved), true)
    const realRoot = await fs.realpath(tempDir)
    assert.equal(resolved.startsWith(realRoot + path.sep), true)
    await assert.doesNotReject(fs.access(resolved))
  })

  test('rejects a traversal that escapes via .. segments', async () => {
    await assert.rejects(resolveSharedRomPath('shared-roms/nes/../../etc/passwd'))
  })

  test('rejects any path containing .. segments', async () => {
    // A decoded "..%2f.." would expand into two ".." segments, which must be rejected.
    await assert.rejects(resolveSharedRomPath(`shared-roms/nes/${decodeURIComponent('..%2f..')}`))
    await assert.rejects(resolveSharedRomPath('shared-roms/../secret.nes'))
  })

  test('rejects an absolute-looking path', async () => {
    await assert.rejects(resolveSharedRomPath('shared-roms//etc/passwd'))
  })
})
