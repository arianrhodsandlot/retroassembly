import { GameList } from '../components/game-list/game-list.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'

export default function HistoryPage({ pageData }: { pageData: any }) {
  const { page, pagination, roms } = pageData

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <LibraryLayout title='History'>
      <MainScrollArea className='z-1 relative flex flex-1' size='2'>
        <div className='flex min-h-full w-full flex-col gap-5 p-4'>
          <div className='relative flex justify-between pt-4 lg:px-4'>
            <h1 className='text-5xl font-semibold'>History</h1>
            <div className='mt-4 hidden items-center gap-2 text-zinc-400 lg:flex'>
              <span className='icon-[mdi--bar-chart] text-black' />
              Played
              <span className='font-bold text-rose-700'>{pagination.total}</span>
              {pagination.total === 1 ? 'game' : 'games'}
            </div>
          </div>
          <GameList key={`history-${page}`} pagination={pagination} />
        </div>
      </MainScrollArea>
    </LibraryLayout>
  )
}
