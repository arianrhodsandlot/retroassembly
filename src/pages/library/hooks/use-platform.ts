import { useParams } from 'react-router'
import { platformMap, type PlatformName } from '#@/constants/platform.ts'

export function usePlatform() {
  const { platform } = useParams<{ platform: PlatformName }>()

  return platform ? platformMap[platform] : undefined
}
