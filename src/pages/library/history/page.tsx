import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../components/main-scroll-area.tsx'
import { PageStats } from '../components/page-stats.tsx'

export default function HistoryPage({ pageData }: Readonly<{ pageData: any }>) {
  const { page, pagination, roms } = pageData

  if (page > 1 && roms.length === 0) {
    return <>404</>
  }

  return (
    <LibraryLayout title='Library'>
      <MainScrollArea>
        <GameListMain>
          <h1 className='text-5xl font-semibold'>History</h1>
          <PageStats>
            <span className='icon-[mdi--bar-chart] text-(--color-text)' />
            Played
            <span className='font-bold text-rose-700'>{pagination.total}</span>
            {pagination.total === 1 ? 'game' : 'games'}
          </PageStats>
        </GameListMain>
      </MainScrollArea>
    </LibraryLayout>
  )
}
