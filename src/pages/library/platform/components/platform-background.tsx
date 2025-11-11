import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import type { loader } from '@/pages/routes/library-platform.tsx'
import { getPlatformBluredBackground } from '@/utils/client/library.ts'
import { MainBackground } from '../../components/main-background.tsx'

export function PlatformBackground() {
  const { t } = useTranslation()
  const { platform } = useLoaderData<typeof loader>()
  const platformBackgroundUrl = getPlatformBluredBackground(platform)
  return (
    <MainBackground
      alt={t(platformMap[platform].displayName)}
      key={platformBackgroundUrl}
      src={platformBackgroundUrl}
    />
  )
}
