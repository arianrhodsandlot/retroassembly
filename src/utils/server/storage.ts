import path from 'node:path'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getDirectories } from '../../constants/env.ts'

export function createStorage() {
  const c = getContext()
  const { BUCKET } = env<Env>(c)
  if (BUCKET) {
    return BUCKET
  }

  const { storageDirectory } = getDirectories()

  return {
    async head(id: string) {
      const filePath = path.join(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      return fs.pathExists(filePath)
    },

    async put(id: string, file: Blob) {
      const filePath = path.join(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      await fs.ensureDir(path.dirname(filePath))
      const { DiskFile } = await import('./disk-file.ts')
      if (file instanceof DiskFile && (await file.moveTo(filePath))) {
        return
      }
      const { createWriteStream } = await import('node:fs')
      const { Readable } = await import('node:stream')
      const { pipeline } = await import('node:stream/promises')
      const { nanoid } = await import('./nanoid.ts')
      // Written under a temporary name first, so an interrupted write never leaves a partial file behind
      const partialFilePath = `${filePath}.${nanoid()}.partial`
      try {
        const readable = Readable.fromWeb(file.stream() as NodeReadableStream)
        await pipeline(readable, createWriteStream(partialFilePath))
        await fs.rename(partialFilePath, filePath)
      } finally {
        await fs.remove(partialFilePath)
      }
    },

    async get(id: string) {
      const filePath = path.join(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      const buffer = await fs.readFile(filePath)
      // Create a mock R2ObjectBody-like object for compatibility with createFileResponse
      const mockR2Object = {
        body: buffer,
        httpEtag: `"${Date.now()}"`,
        size: buffer.length,
      }
      return mockR2Object
    },

    async delete(id: string) {
      const filePath = path.join(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      await fs.remove(filePath)
    },
  }
}
