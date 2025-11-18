import { clsx } from 'clsx'
import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { platformMap } from '#@/constants/platform.ts'
import type { loader } from '#@/pages/routes/library-platform.tsx'
import { DeviceInfo } from '../components/device-info/device-info.tsx'
import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { PageStats } from '../components/page-stats.tsx'
import { useIsDemo } from '../hooks/use-demo.ts'
import { PlatformBackground } from './components/platform-background.tsx'
import { UploadButton } from './components/upload-button.tsx'

export default function PlatformPage() {
  const { t } = useTranslation()
  const { pagination, platform, platformInfo, roms } = useLoaderData<typeof loader>()
  const gameLabel = t('game', { count: pagination.total })
  const isDemo = useIsDemo()

  if (!platformMap[platform]) {
    return <>{t('404')}</>
  }

  if (pagination.current > 1 && roms.length === 0) {
    return <>{t('404')}</>
  }

  return (
    <LibraryLayout>
      <PlatformBackground />
      <GameListMain>
        <div className={clsx('flex w-full justify-between', { 'flex-col': platformInfo })}>
          {platformInfo ? (
            <DeviceInfo key={platform} platform={platform} platformInfo={platformInfo} />
          ) : (
            <h1 className='text-5xl font-semibold'>{t(platformMap[platform].displayName)}</h1>
          )}

          {isDemo ? undefined : (
            <PageStats suffix={<UploadButton platform={platform} />}>
              <span className='icon-[mdi--bar-chart] text-(--color-text)' />
              <Trans
                components={{
                  1: <span className='text-(--accent-9) font-semibold' />,
                }}
                i18nKey='platformGamesStats'
                values={{
                  game: gameLabel,
                  gameCount: pagination.total,
                  platform: t(platformMap[platform].displayName),
                }}
              />
            </PageStats>
          )}
        </div>
      </GameListMain>
    </LibraryLayout>
  )
}
