import { getContext } from 'hono/context-storage'
import { HydrationBoundary } from 'jotai-ssr'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { preferenceAtom } from '@/pages/atoms.ts'
import { platformAtom, romsAtom } from '../atoms.ts'
import { DeviceInfo } from '../components/device-info/device-info.tsx'
import { GameList } from '../components/game-list/game-list.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../components/page-breadcrumb.tsx'
import { getHydrateAtoms } from '../utils/hydrate-atoms.ts'
import type { Route } from './+types/page.ts'
import { PlatformBackground } from './components/platform-background.tsx'
import { UploadButton } from './components/upload-button.tsx'

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') || '1', 10) || 1
  const { platform } = params
  const { pagination, roms } = await getRoms({ page, platform })
  const { preference } = getContext().var
  const platformInfo = await getPlatformInfo(platform)

  return { page, pagination, platform, platformInfo, preference, roms }
}

export default function PlatformPage({ loaderData }: Route.ComponentProps) {
  const { page, pagination, platform, platformInfo, preference, roms } = loaderData

  if (!platformMap[platform]) {
    return '404 not found'
  }

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <HydrationBoundary
      hydrateAtoms={getHydrateAtoms({
        override: [
          [preferenceAtom, preference],
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
            <DeviceInfo key={platform} platform={platform} platformInfo={platformInfo} />
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
