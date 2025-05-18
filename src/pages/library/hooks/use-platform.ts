import { useParams } from 'react-router'
import { platformMap } from '@/constants/platform.ts'

export function usePlatform() {
  const { platform } = useParams<{ platform: string }>()

  return platform ? platformMap[platform] : undefined
}
