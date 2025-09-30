import { useLoaderData } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformBluredBackground } from '@/utils/client/library.ts'
import { MainBackground } from '../../components/main-background.tsx'

export function PlatformBackground() {
  const { platform } = useLoaderData()
  const platformBackgroundUrl = getPlatformBluredBackground(platform)
  return (
    <MainBackground alt={platformMap[platform].displayName} key={platformBackgroundUrl} src={platformBackgroundUrl} />
  )
}
