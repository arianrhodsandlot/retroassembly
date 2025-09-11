import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-history.tsx'
import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { PageStats } from '../components/page-stats.tsx'

export default function HistoryPage() {
  const { page, pagination, roms, title } = useLoaderData<typeof loader>()

  if (page > 1 && roms.length === 0) {
    return <>404</>
  }

  return (
    <LibraryLayout>
      <GameListMain>
        <h1 className='text-5xl font-semibold'>{title}</h1>
        <PageStats>
          <span className='icon-[mdi--bar-chart] text-(--color-text)' />
          Played
          <span className='font-bold text-rose-700'>{pagination.total}</span>
          {pagination.total === 1 ? 'game' : 'games'}
        </PageStats>
      </GameListMain>
    </LibraryLayout>
  )
}
