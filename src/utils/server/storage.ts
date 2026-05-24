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
      const { base, dir } = path.parse(id)
      const fileTargetDirectory = path.join(storageDirectory, dir)
      const { default: fs } = await import('fs-extra')
      await fs.ensureDir(fileTargetDirectory)
      const { createWriteStream } = await import('node:fs')
      const { Readable } = await import('node:stream')
      const { pipeline } = await import('node:stream/promises')
      const readable = Readable.fromWeb(file.stream() as NodeReadableStream)
      const writable = createWriteStream(path.join(fileTargetDirectory, base))
      await pipeline(readable, writable)
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
