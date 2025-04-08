import { getContext } from 'hono/context-storage'
import { platformMap } from '../constants/platform.ts'

export type PlatformInfo = Awaited<ReturnType<typeof getPlatformInfo>>

export async function getPlatformInfo(platform: string) {
  const { db } = getContext().var
  const { metadata } = db

  return await metadata.query.launchboxPlatformTable.findFirst({
    where: ({ name }, { eq }) => eq(name, platformMap[platform].launchboxName),
  })
}
