import { getContextData } from 'waku/middleware/context'
import { platformMap } from '../constants/platform.ts'

export async function getPlatformInfo(platform: string) {
  const { db } = getContextData()
  const { metadata } = db

  const { launchboxName } = platformMap[platform]
  if (launchboxName) {
    return await metadata.query.launchboxPlatform.findFirst({
      where: ({ name }, { eq }) => eq(name, launchboxName),
    })
  }
}
