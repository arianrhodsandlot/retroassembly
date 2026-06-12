import path from 'node:path'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { attempt, attemptAsync } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getDirectories } from '../../constants/env.ts'
import { isSharedRomFileId, resolveSharedRomPath } from './shared-rom.ts'

export function createStorage() {
  // Tolerate being called outside of a request context (e.g. background tasks, tests). On workerd
  // the BUCKET binding is only available via the request context; on node it is always absent.
  const [, c] = attempt(getContext)
  const BUCKET = c ? env<Env>(c).BUCKET : undefined
  if (BUCKET) {
    return BUCKET
  }

  const { storageDirectory } = getDirectories()

  return {
    async head(id: string) {
      const { default: fs } = await import('fs-extra')
      if (isSharedRomFileId(id)) {
        const [, sharedPath] = await attemptAsync(() => resolveSharedRomPath(id))
        return sharedPath ? fs.pathExists(sharedPath) : false
      }
      const filePath = path.join(storageDirectory, id)
      return fs.pathExists(filePath)
    },

    async put(id: string, file: Blob) {
      // Shared ROM files are host-mounted and read-only; never write into the shared directory.
      if (isSharedRomFileId(id)) {
        throw new Error('Cannot write to a shared ROM file')
      }
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
      const { default: fs } = await import('fs-extra')
      const filePath = isSharedRomFileId(id) ? await resolveSharedRomPath(id) : path.join(storageDirectory, id)
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
      // Shared ROM files are host-mounted; deleting a row must never unlink the source file.
      if (isSharedRomFileId(id)) {
        return
      }
      const filePath = path.join(storageDirectory, id)
      const { default: fs } = await import('fs-extra')
      await fs.remove(filePath)
    },
  }
}
