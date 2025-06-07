import { getContext } from 'hono/context-storage'

export async function getFileContent(id: string) {
  const { storage } = getContext().var

  const object = await storage.get(id)
  return object
}
