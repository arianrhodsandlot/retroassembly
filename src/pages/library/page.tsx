import { HydrationBoundary } from 'jotai-ssr'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import { preferenceAtom } from '../atoms.ts'
import { GameList } from './components/game-list/game-list.tsx'
import LibraryLayout from './components/library-layout/library-layout.tsx'
import { MainScrollArea } from './components/main-scroll-area.tsx'
import { useIsDemo } from './hooks/use-demo.ts'
import { UploadSelectButton } from './platform/components/upload-select-button.tsx'

interface LibraryPageProps {
  pageData: {
    page: number
    pagination: any
    platformCount: number
    preference: ResolvedPreference
    roms: Roms
  }
}

export default function LibraryPage({ pageData }: LibraryPageProps) {
  const { page, pagination, platformCount, preference, roms } = pageData
  const isDemo = useIsDemo()

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <HydrationBoundary hydrateAtoms={[[preferenceAtom, preference]]}>
      <LibraryLayout title='Library'>
        <MainScrollArea className='z-1 relative flex flex-1' size='2'>
          <div className='flex min-h-full w-full flex-col gap-5 p-4'>
            <div className='relative flex justify-between px-4 pt-4'>
              <div>
                <h1 className='text-5xl font-semibold'>Library</h1>
                {isDemo ? (
                  <div className='mt-4 flex items-center gap-1 text-sm text-neutral-500'>
                    <span className='icon-[mdi--information-outline]' />
                    These free (legal) games are all picked from the retrobrew project for the purpose of demonstration.
                  </div>
                ) : null}
              </div>
              {isDemo ? null : (
                <div className='flex items-center justify-end gap-4 pr-4'>
                  <div className='flex items-center gap-2 text-zinc-400'>
                    <span className='icon-[mdi--bar-chart] text-black' />
                    <span className='text-(--accent-9) font-semibold'>{pagination.total}</span> games for{' '}
                    <span className='text-(--accent-9) font-semibold'>{platformCount}</span>{' '}
                    {platformCount === 1 ? 'platform' : 'platforms'} in total.
                  </div>
                  <UploadSelectButton />
                </div>
              )}
            </div>
            <GameList key={`library-${page}`} pagination={pagination} />
          </div>
        </MainScrollArea>
      </LibraryLayout>
    </HydrationBoundary>
  )
}
