import { msleuth } from '../utils/msleuth.ts'

export type PlatformInfo = Awaited<ReturnType<typeof getPlatformInfo>>

const cache = {}
export async function getPlatformInfo(platform: string) {
  if (platform in cache) {
    return await cache[platform]
  }
  const platformInfoPromise = msleuth.getPlatform(platform)
  cache[platform] = platformInfoPromise
  return platformInfoPromise
}
