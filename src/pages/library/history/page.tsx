import { HydrationBoundary } from 'jotai-ssr'
import { preferenceAtom } from '@/pages/atoms.ts'
import { romsAtom } from '../atoms.ts'
import { GameList } from '../components/game-list/game-list.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { getHydrateAtoms } from '../utils/hydrate-atoms.ts'

export default function HistoryPage({ pageData }: { pageData: any }) {
  const { page, pagination, preference, roms } = pageData

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <HydrationBoundary
      hydrateAtoms={getHydrateAtoms({
        override: [
          [preferenceAtom, preference],
          [romsAtom, roms],
        ],
      })}
      options={{ enableReHydrate: true }}
    >
      <LibraryLayout title='History'>
        <MainScrollArea className='z-1 relative flex flex-1' size='2'>
          <div className='flex min-h-full w-full flex-col gap-5 p-4'>
            <div className='relative flex justify-between px-4 pt-4'>
              <h1 className='text-5xl font-[Oswald_Variable] font-semibold'>History</h1>
              <div className='mt-4 flex items-center gap-2 text-zinc-400'>
                <span className='icon-[mdi--bar-chart] text-black' />
                Played
                <span className='font-[DSEG7_Modern] font-bold text-rose-700'>{pagination.total}</span>
                games.
              </div>
            </div>
            <hr className='border-t-1 border-t-black/20' />
            <GameList pagination={pagination} />
          </div>
        </MainScrollArea>
      </LibraryLayout>
    </HydrationBoundary>
  )
}
