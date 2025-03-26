import { HydrationBoundary } from 'jotai-ssr'
import { platformMap } from '@/constants/platform.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { platformAtom, romsAtom } from '../atoms.ts'
import { DeviceInfo } from '../components/device-info/device-info.tsx'
import { GameList } from '../components/game-list/game-list.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../components/page-breadcrumb.tsx'
import { getHydrateAtoms } from '../utils/hydrate-atoms.ts'
import { PlatformBackground } from './components/platform-background.tsx'
import { UploadButton } from './components/upload-button.tsx'

interface PlatformPageProps {
  platform: string
  query: string
}

export async function PlatformPage({ platform, query }: PlatformPageProps) {
  if (!platformMap[platform]) {
    return '404 not found'
  }

  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const { pagination, roms } = await getRoms({ page, platform })

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <HydrationBoundary
      hydrateAtoms={getHydrateAtoms({
        override: [
          [platformAtom, platformMap[platform]],
          [romsAtom, roms],
        ],
      })}
      options={{ enableReHydrate: true }}
    >
      <LibraryLayout title={platformMap[platform].displayName}>
        <MainScrollArea className='z-1 relative flex flex-1' size='2'>
          <PageBreadcrumb />
          <div className='flex min-h-full w-full flex-col gap-5 p-4'>
            <DeviceInfo platform={platform} />
            <hr className='border-t-1 border-t-black/20' />
            <GameList pagination={pagination} />
            <UploadButton platform={platform} />
          </div>
        </MainScrollArea>
        <PlatformBackground platform={platform} />
      </LibraryLayout>
    </HydrationBoundary>
  )
}
