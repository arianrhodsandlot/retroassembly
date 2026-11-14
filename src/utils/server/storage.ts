import path from 'node:path'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { getDirectories } from '../../constants/env.ts'

/**
 * The path of a stored file in the storage directory. An id that would resolve outside it (one with "..", or an
 * absolute path) is refused, since ids can come from request URLs.
 */
export function getStorageFilePath(storageDirectory: string, id: string) {
  const root = path.resolve(storageDirectory)
  const filePath = path.resolve(root, id)
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    throw new HTTPException(400, { message: 'Invalid file id' })
  }
  return filePath
}

export function createStorage() {
  const c = getContext()
  const { BUCKET } = env<Env>(c)
  if (BUCKET) {
    return BUCKET
  }

  const { storageDirectory } = getDirectories()

  return {
    async head(id: string) {
      const filePath = getStorageFilePath(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      return fs.pathExists(filePath)
    },

    async put(id: string, file: Blob) {
      const filePath = getStorageFilePath(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      await fs.ensureDir(path.dirname(filePath))
      const { createWriteStream } = await import('node:fs')
      const { Readable } = await import('node:stream')
      const { pipeline } = await import('node:stream/promises')
      const readable = Readable.fromWeb(file.stream() as NodeReadableStream)
      const writable = createWriteStream(filePath)
      await pipeline(readable, writable)
    },

    async get(id: string) {
      const filePath = getStorageFilePath(storageDirectory, id)
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
      const filePath = getStorageFilePath(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      await fs.remove(filePath)
    },
  }
}
