import { getContextData } from 'waku/middleware/context'
import { platformMap } from '../constants/platform.ts'

export async function getPlatformInfo(platform: string) {
  const { db } = getContextData()
  const { metadata } = db

  return await metadata.query.launchboxPlatformTable.findFirst({
    where: ({ name }, { eq }) => eq(name, platformMap[platform].launchboxName),
  })
}
