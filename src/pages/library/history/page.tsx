import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-history.tsx'
import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { PageStats } from '../components/page-stats.tsx'

export default function HistoryPage() {
  const { t } = useTranslation()
  const { page, pagination, roms, title } = useLoaderData<typeof loader>()
  const gameLabel = t('game', { count: pagination.total })

  if (page > 1 && roms.length === 0) {
    return <>{t('404')}</>
  }

  return (
    <LibraryLayout>
      <GameListMain>
        <h1 className='text-5xl font-semibold'>{title}</h1>
        <PageStats>
          <span className='icon-[mdi--bar-chart] text-(--color-text)' />
          <Trans
            components={{
              1: <span className='font-bold text-rose-700' />,
            }}
            i18nKey='playedGamesStats'
            values={{
              game: gameLabel,
              gameCount: pagination.total,
            }}
          />
        </PageStats>
      </GameListMain>
    </LibraryLayout>
  )
}
