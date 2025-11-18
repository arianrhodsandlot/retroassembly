import { getContext } from 'hono/context-storage'
import { platformMap } from '#@/constants/platform.ts'

export type PlatformInfo = Awaited<ReturnType<typeof getPlatformInfo>>

export function getPlatformInfo(platform: string) {
  const { t } = getContext().var
  const platformInfo = { ...platformMap[platform].info, notes: t(platformMap[platform].info.notesI18nKey) }
  return platformInfo
}
