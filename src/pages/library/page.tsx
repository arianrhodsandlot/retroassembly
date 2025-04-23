import { HydrationBoundary } from 'jotai-ssr'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import { preferenceAtom } from '../atoms.ts'
import { romsAtom } from './atoms.ts'
import { GameList } from './components/game-list/game-list.tsx'
import LibraryLayout from './components/library-layout/library-layout.tsx'
import { MainScrollArea } from './components/main-scroll-area.tsx'
import { getHydrateAtoms } from './utils/hydrate-atoms.ts'

interface LibraryPageProps {
  pageData: {
    count: number
    page: number
    pagination: any
    platformCount: number
    preference: ResolvedPreference
    roms: Roms
  }
}

export default function LibraryPage({ pageData }: LibraryPageProps) {
  const { count, page, pagination, platformCount, preference, roms } = pageData

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
      <LibraryLayout title='Library'>
        <MainScrollArea className='z-1 relative flex flex-1' size='2'>
          <div className='flex min-h-full w-full flex-col gap-5 p-4'>
            <div className='relative flex justify-between px-4 pt-4'>
              <h1 className='text-5xl font-semibold'>Library</h1>
              <div className='mt-4 flex items-center gap-2 text-zinc-400'>
                <span className='icon-[mdi--bar-chart] text-black' />
                <span className='text-(--accent-9) font-[DSEG7_Modern] font-bold'>{count}</span> games for{' '}
                <span className='text-(--accent-9) font-[DSEG7_Modern] font-bold'>{platformCount}</span> platforms in
                total
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
