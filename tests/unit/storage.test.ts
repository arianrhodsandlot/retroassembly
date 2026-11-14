import assert from 'node:assert/strict'
import path from 'node:path'
import { describe, it } from 'node:test'
import { getStorageFilePath } from '#@/utils/server/storage.ts'

await describe('storage file paths', async () => {
  const storageDirectory = path.resolve('/data/storage')

  await it('keeps ids inside the storage directory', () => {
    assert.equal(
      getStorageFilePath(storageDirectory, 'roms/nes/abc.nes'),
      path.join(storageDirectory, 'roms/nes/abc.nes'),
    )
    assert.equal(
      getStorageFilePath(storageDirectory, 'roms/../states/a.state'),
      path.join(storageDirectory, 'states/a.state'),
    )
  })

  await it('refuses ids that resolve outside the storage directory', () => {
    for (const id of [
      '../retroassembly.sqlite',
      'roms/../../secret.txt',
      '/etc/passwd',
      '',
      '.',
      '../storage-other/a',
    ]) {
      assert.throws(() => getStorageFilePath(storageDirectory, id), { message: 'Invalid file id' }, id)
    }
  })
})
