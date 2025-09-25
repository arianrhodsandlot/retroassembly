import { msleuth } from '../../utils/server/msleuth.ts'

export type PlatformInfo = Awaited<ReturnType<typeof getPlatformInfo>>

const cache = {}
export async function getPlatformInfo(platform: string) {
  if (platform in cache) {
    try {
      const result = await cache[platform]
      if (result) {
        return result
      }
      delete cache[platform]
    } catch {
      delete cache[platform]
    }
  }
  const platformInfoPromise = msleuth.getPlatform(platform)
  return platformInfoPromise
}
