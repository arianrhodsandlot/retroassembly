import clsx from 'clsx'
import { platformMap } from '@/constants/platform.ts'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { PlatformInfo } from '@/controllers/get-platform-info.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import { DeviceInfo } from '../components/device-info/device-info.tsx'
import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { PageStats } from '../components/page-stats.tsx'
import { useIsDemo } from '../hooks/use-demo.ts'
import { PlatformBackground } from './components/platform-background.tsx'
import { UploadButton } from './components/upload-button.tsx'

interface PlatformPageProps {
  pageData: {
    page: number
    pagination: { current: number; pages: number; size: number; total: number }
    platform: string
    platformInfo: PlatformInfo
    preference: ResolvedPreference
    roms: Roms
  }
}

export default function PlatformPage({ pageData }: Readonly<PlatformPageProps>) {
  const { page, pagination, platform, platformInfo, roms } = pageData
  // let platformInfo = 0
  const isDemo = useIsDemo()

  if (!platformMap[platform]) {
    return <>404 not found</>
  }

  if (page > 1 && roms.length === 0) {
    return <>404</>
  }

  return (
    <LibraryLayout title='Library'>
      <MainScrollArea>
        <GameListMain>
          <div className={clsx('flex w-full justify-between', { 'flex-col': platformInfo })}>
            {platformInfo ? (
              <DeviceInfo key={platform} platform={platform} platformInfo={platformInfo} />
            ) : (
              <h1 className='text-5xl font-semibold'>{platformMap[platform].displayName}</h1>
            )}

            {isDemo ? undefined : (
              <PageStats suffix={<UploadButton platform={platform} />}>
                <span className='icon-[mdi--bar-chart] text-(--color-text)' />
                <span className='text-(--accent-9) font-semibold'>{pagination.total}</span>
                {pagination.total === 1 ? 'game' : 'games'} for {platformMap[platform].displayName}.
              </PageStats>
            )}
          </div>
        </GameListMain>
      </MainScrollArea>
      <PlatformBackground />
    </LibraryLayout>
  )
}
