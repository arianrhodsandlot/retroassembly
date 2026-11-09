import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { after, before, describe, it } from 'node:test'
import { setTimeout } from 'node:timers/promises'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { z } from 'zod'
import { DiskFile } from '#@/utils/server/disk-file.ts'
import { getFilePartialDigest } from '#@/utils/server/file.ts'
import { createStorage } from '#@/utils/server/storage.ts'
import { streamFormData } from '#@/utils/server/stream-form-data.ts'

const storageDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'retroassembly-stream-form-data-'))
const uploadsDirectory = path.join(storageDirectory, 'tmp', 'uploads')
const headers = { 'Content-Type': 'multipart/form-data; boundary=boundary' }
const platformPart = 'Content-Disposition: form-data; name="platform"\r\n\r\npsx'

function filePart(rawFileName: string, content = 'ROM') {
  return `Content-Disposition: form-data; name="file"; filename="${rawFileName}"\r\nContent-Type: application/octet-stream\r\n\r\n${content}`
}

function multipart(parts: string[]) {
  return {
    body: `${parts.map((part) => `--boundary\r\n${part}\r\n`).join('')}--boundary--\r\n`,
    headers,
    method: 'POST',
  }
}

async function* failingRead() {
  yield Buffer.from('partial')
  await setTimeout(10)
  throw new Error('read failed')
}

function listUploads() {
  return fs.existsSync(uploadsDirectory) ? fs.readdirSync(uploadsDirectory) : []
}

function createApp(onFile?: (file: File) => Promise<void> | void) {
  return new Hono()
    .use(contextStorage())
    .post(
      '/',
      streamFormData(),
      zValidator('form', z.object({ file: z.instanceof(File), md5: z.string().optional(), platform: z.string() })),
      async (c) => {
        await onFile?.(c.req.valid('form').file)
        return c.text('ok')
      },
    )
}

await describe('streamFormData', async () => {
  before(() => {
    process.env.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY = storageDirectory
  })

  after(() => {
    delete process.env.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY
    fs.rmSync(storageDirectory, { force: true, recursive: true })
  })

  await it('streams the upload to disk and moves it into storage', async () => {
    const content = new Uint8Array(300_000).map((_, index) => (index * 7) % 251)
    const original = new File([content], 'Gran Turismo 2 (Disc 1) – é.chd')
    const body = new FormData()
    body.append('platform', 'psx')
    body.append('file', original)

    const storedPath = path.join(storageDirectory, 'roms', 'psx', 'game.chd')
    const response = await createApp(async (file) => {
      assert.ok(file instanceof DiskFile)
      assert.equal(file.name, original.name)
      assert.equal(file.size, original.size)
      assert.equal(await getFilePartialDigest(file), await getFilePartialDigest(original))
      assert.equal(listUploads().length, 1)
      await createStorage().put('roms/psx/game.chd', file)
      assert.deepEqual(listUploads(), [])
    }).request('/', { body, method: 'POST' })

    assert.equal(response.status, 200)
    assert.deepEqual(fs.readFileSync(storedPath), Buffer.from(content))
    assert.deepEqual(fs.readdirSync(path.dirname(storedPath)), ['game.chd'])
  })

  await it('keeps file names the same as Request.formData() does', async () => {
    // Raw header values as browsers send them: `"` is escaped as %22, and backslashes are sent as-is
    for (const rawFileName of [String.raw`AC\DC.nes`, String.raw`C:\roms\mario.nes`, 'a%22b.nes', 'line%0Abreak.nes']) {
      const request = multipart([platformPart, filePart(rawFileName)])
      const nativeFormData = await new Request('http://localhost/', request).formData()
      const nativeFile = nativeFormData.get('file')
      assert.ok(nativeFile instanceof File)
      let name = ''
      await createApp((file) => {
        assert.ok(file instanceof DiskFile)
        name = file.name
      }).request('/', request)
      assert.equal(name, nativeFile.name, `name for ${rawFileName}`)
    }
  })

  await it('rejects malformed bodies with 400', async () => {
    const truncated = await createApp().request('/', {
      body: `--boundary\r\n${filePart('a.bin')}`,
      headers,
      method: 'POST',
    })
    assert.equal(truncated.status, 400)
    assert.match(await truncated.text(), /Unexpected end of form/u)

    const noBoundary = await createApp().request('/', {
      body: 'irrelevant',
      headers: { 'Content-Type': 'multipart/form-data' },
      method: 'POST',
    })
    assert.equal(noBoundary.status, 400)
    assert.match(await noBoundary.text(), /Boundary not found/u)
    assert.deepEqual(listUploads(), [])
  })

  await it('removes the temporary file of an upload that is aborted mid-file', async () => {
    let uploadsDuringRequest = 0
    const body = Readable.toWeb(
      Readable.from(
        (async function* body() {
          yield Buffer.from(`--boundary\r\n${filePart('a.bin', 'x'.repeat(64 * 1024))}`)
          await setTimeout(50)
          uploadsDuringRequest = listUploads().length
          throw new Error('client went away')
        })(),
      ),
    )
    // @ts-expect-error -- `duplex` is required by Node for streamed bodies but missing from the DOM types
    const response = await createApp().request('/', { body, duplex: 'half', headers, method: 'POST' })
    assert.equal(response.status, 400)
    assert.equal(uploadsDuringRequest, 1)
    assert.deepEqual(listUploads(), [])
  })

  await it('allows one file and up to 16 small fields, and rejects more with 413', async () => {
    const fields = Array.from({ length: 16 }, (_, index) => `Content-Disposition: form-data; name="f${index}"\r\n\r\nv`)
    const allowed = await createApp().request('/', multipart([...fields.slice(1), platformPart, filePart('a.bin')]))
    assert.equal(allowed.status, 200)

    const tooManyFields = await createApp().request('/', multipart([...fields, platformPart, filePart('a.bin')]))
    assert.equal(tooManyFields.status, 413)

    const tooManyFiles = await createApp().request('/', multipart([platformPart, filePart('a.bin'), filePart('b.bin')]))
    assert.equal(tooManyFiles.status, 413)
    assert.deepEqual(listUploads(), [])
  })

  await it('rejects an oversized field before the file with 413 instead of hanging', async () => {
    const oversizedField = `--boundary\r\nContent-Disposition: form-data; name="md5"\r\n\r\n${'x'.repeat(70_000)}\r\n`
    const chunks = [oversizedField, `--boundary\r\n${filePart('a.bin')}\r\n`, '--boundary--\r\n']
    const body = Readable.toWeb(
      Readable.from(
        (async function* body() {
          for (const chunk of chunks) {
            yield Buffer.from(chunk)
            await setTimeout(10)
          }
        })(),
      ),
    )
    // @ts-expect-error -- see above
    const response = await createApp().request('/', { body, duplex: 'half', headers, method: 'POST' })
    assert.equal(response.status, 413)
    assert.deepEqual(listUploads(), [])
  })

  await it('recreates the temporary directory if it has been removed', async () => {
    fs.rmSync(uploadsDirectory, { force: true, recursive: true })
    let isDiskFile = false
    const response = await createApp((file) => {
      isDiskFile = file instanceof DiskFile
    }).request('/', multipart([platformPart, filePart('a.bin')]))
    assert.equal(response.status, 200)
    assert.equal(isDiskFile, true)
  })

  await it(
    'fails with 500 when a temporary file cannot be written',
    { skip: process.getuid?.() === 0 && 'file permissions are not enforced for root' },
    async () => {
      fs.mkdirSync(uploadsDirectory, { recursive: true })
      fs.chmodSync(uploadsDirectory, 0o500)
      try {
        const response = await createApp().request(
          '/',
          multipart([platformPart, filePart('a.bin', 'x'.repeat(1024 * 1024))]),
        )
        assert.equal(response.status, 500)
      } finally {
        fs.chmodSync(uploadsDirectory, 0o700)
      }
      assert.deepEqual(listUploads(), [])
    },
  )
})

await describe('DiskFile', async () => {
  const content = new Uint8Array(5000).map((_, index) => index % 256)
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'retroassembly-disk-file-'))
  const filePath = path.join(directory, 'rom.bin')

  before(() => fs.writeFileSync(filePath, content))
  after(() => fs.rmSync(directory, { force: true, recursive: true }))

  await it('matches a native Blob for slices', async () => {
    const blob = new Blob([content])
    const diskFile = new DiskFile({ end: content.byteLength, name: 'rom.bin', path: filePath })
    const ranges = [[], [0, 1024], [-1024], [100, 50], [10, 99_999], [-99_999, 10], [4999, 5000], [0, 0]]
    for (const [start, end] of ranges) {
      const expected = new Uint8Array(await blob.slice(start, end).arrayBuffer())
      const slice = diskFile.slice(start, end)
      assert.equal(slice.size, expected.byteLength)
      assert.deepEqual(new Uint8Array(await slice.arrayBuffer()), expected)
      assert.deepEqual(new Uint8Array(await new Response(slice.stream()).arrayBuffer()), expected)
    }
    assert.deepEqual(
      new Uint8Array(await diskFile.slice(100, 4000).slice(-500, -100).arrayBuffer()),
      content.slice(3500, 3900),
    )
  })

  await it('fails instead of returning padding when the file is shorter than expected', async () => {
    const diskFile = new DiskFile({ end: content.byteLength + 10, name: 'rom.bin', path: filePath })
    await assert.rejects(diskFile.arrayBuffer(), /Unexpected end of file/u)
  })

  await it('moves the whole file, and slices keep reading it', async () => {
    const source = path.join(directory, 'source.bin')
    const destination = path.join(directory, 'destination.bin')
    fs.writeFileSync(source, content)
    const diskFile = new DiskFile({ end: content.byteLength, name: 'rom.bin', path: source })
    const slice = diskFile.slice(-10)

    assert.equal(await slice.moveTo(destination), false)
    assert.equal(await diskFile.moveTo(destination), true)
    assert.equal(fs.existsSync(source), false)
    assert.deepEqual(new Uint8Array(await slice.arrayBuffer()), content.slice(-10))
  })

  await it('reports the right size for files of 4 GiB or more', async () => {
    const sparsePath = path.join(directory, 'sparse.bin')
    const size = 5 * 1024 ** 3 + 123
    const handle = await fs.promises.open(sparsePath, 'w')
    await handle.truncate(size)
    await handle.write(Buffer.from('tail'), 0, 4, size - 4)
    await handle.close()

    const diskFile = new DiskFile({ end: size, name: 'disc.iso', path: sparsePath })
    assert.equal(diskFile.size, size)
    assert.equal(await diskFile.slice(-4).text(), 'tail')
    fs.rmSync(sparsePath)
  })
})

await describe('storage.put', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'retroassembly-storage-'))

  before(() => {
    process.env.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY = directory
  })

  after(() => {
    delete process.env.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY
    fs.rmSync(directory, { force: true, recursive: true })
  })

  await it('leaves nothing behind when a write fails', async () => {
    const failingBlob = new Blob(['unused'])
    failingBlob.stream = () =>
      // @ts-expect-error -- Node's web ReadableStream type differs from the DOM one, but they are the same at runtime
      Readable.toWeb(Readable.from(failingRead()))
    let result = ''
    const app = new Hono().use(contextStorage()).post('/', async (c) => {
      const [settled] = await Promise.allSettled([createStorage().put('roms/psx/a.chd', failingBlob)])
      result = settled.status
      return c.text('ok')
    })
    await app.request('/', { method: 'POST' })
    assert.equal(result, 'rejected')
    assert.deepEqual(fs.readdirSync(path.join(directory, 'roms', 'psx')), [])
  })
})
