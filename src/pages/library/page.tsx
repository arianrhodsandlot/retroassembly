import { getRomPlatformCount } from '@/controllers/get-rom-platform-count.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { GameList } from './components/game-list/game-list.tsx'
import LibraryLayout from './components/library-layout/library-layout.tsx'
import { MainScrollArea } from './components/main-scroll-area.tsx'

export async function LibraryPage({ query }: { query: string }) {
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const [{ pagination, roms }, platformCount] = await Promise.all([getRoms({ page }), getRomPlatformCount()])

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <LibraryLayout title='Library'>
      <MainScrollArea className='z-1 relative flex flex-1' size='2'>
        <main className='flex min-h-full w-full flex-col gap-5 p-4'>
          <div className='relative flex justify-between px-4 pt-4'>
            <h1 className='text-5xl font-[Oswald_Variable] font-semibold'>Library</h1>
            <div className='mt-4 flex items-center gap-2 text-zinc-400'>
              <span className='icon-[mdi--bar-chart] text-black' />
              <span className='font-[DSEG7_Modern] font-bold text-[var(--accent-9)]'>{roms.length}</span> games for{' '}
              <span className='font-[DSEG7_Modern] font-bold text-[var(--accent-9)]'>{platformCount}</span> platforms in
              total
            </div>
          </div>
          <hr className='border-t-1 border-t-black/20' />
          <GameList pagination={pagination} roms={roms} />
        </main>
      </MainScrollArea>
    </LibraryLayout>
  )
}
