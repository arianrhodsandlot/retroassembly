import path from 'node:path'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'

export function createStorage() {
  const c = getContext()
  const { BUCKET } = env(c)
  if (BUCKET) {
    return BUCKET
  }

  const storageBaseDirectory = path.join('data', 'storage')
  return {
    async put(id: string, file: File) {
      const { base, dir } = path.parse(id)
      const fileTargetDirectory = path.join(storageBaseDirectory, dir)
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const fs = await import('fs-extra')
      await fs.ensureDir(fileTargetDirectory)
      await fs.writeFile(path.join(fileTargetDirectory, base), buffer)
    },

    async get(id: string) {
      const filePath = path.join(storageBaseDirectory, id)
      const fs = await import('fs-extra')
      const buffer = await fs.readFile(filePath)
      // Create a mock R2ObjectBody-like object for compatibility with createFileResponse
      const mockR2Object = {
        body: buffer,
        httpEtag: `"${Date.now()}"`,
        size: buffer.length,
      }
      return mockR2Object
    },
  }
}
