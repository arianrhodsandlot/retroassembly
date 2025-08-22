import { platformMap } from '@/constants/platform.ts'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { PlatformInfo } from '@/controllers/get-platform-info.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import { DeviceInfo } from '../components/device-info/device-info.tsx'
import { GameList } from '../components/game-list/game-list.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../components/page-breadcrumb.tsx'
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

export default function PlatformPage({ pageData }: PlatformPageProps) {
  const { page, pagination, platform, platformInfo, roms } = pageData
  const isDemo = useIsDemo()

  if (!platformMap[platform]) {
    return '404 not found'
  }

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <LibraryLayout title={platformMap[platform].displayName}>
      <MainScrollArea>
        <PageBreadcrumb />
        <div className='flex min-h-full w-full flex-col gap-5 p-4'>
          <DeviceInfo key={platform} platform={platform} platformInfo={platformInfo} />
          {isDemo ? null : (
            <div className='mt-4 flex flex-col items-end justify-end gap-4 lg:mt-0 lg:flex-row lg:items-center lg:pr-4'>
              <div className='text-(--gray-11) flex items-center justify-end gap-2'>
                <span className='icon-[mdi--bar-chart] text-(--color-text)' />
                <span className='text-(--accent-9) font-semibold'>{pagination.total}</span>
                {pagination.total === 1 ? 'game' : 'games'} for {platformMap[platform].displayName}.
              </div>
              <UploadButton platform={platform} />
            </div>
          )}
          <GameList key={`${platform}-${page}`} pagination={pagination} />
        </div>
      </MainScrollArea>
      <PlatformBackground platform={platform} />
    </LibraryLayout>
  )
}
