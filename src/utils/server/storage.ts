import path from 'node:path'
import fs from 'fs-extra'
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
      return await fs.pathExists(filePath)
    },

    async put(id: string, file: Blob) {
      const { base, dir } = path.parse(id)
      const fileTargetDirectory = path.join(storageDirectory, dir)
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await fs.ensureDir(fileTargetDirectory)
      await fs.writeFile(path.join(fileTargetDirectory, base), buffer)
    },

    async get(id: string) {
      const filePath = path.join(storageDirectory, id)
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
      await fs.remove(filePath)
    },
  }
}
