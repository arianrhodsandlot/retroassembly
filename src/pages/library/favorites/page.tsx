import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '#@/pages/routes/library-favorites.tsx'
import { GameListMain } from '../components/game-list-main.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { PageStats } from '../components/page-stats.tsx'

export default function FavoritesPage() {
  const { t } = useTranslation()
  const { pagination, roms } = useLoaderData<typeof loader>()
  const gameLabel = t('game', { count: pagination.total })

  if (pagination.current > 1 && roms.length === 0) {
    return <>{t('404')}</>
  }

  return (
    <LibraryLayout>
      <GameListMain>
        <h1 className='text-5xl font-semibold'>{t('Favorites')}</h1>
        <PageStats>
          <span className='icon-[mdi--star] text-(--color-text)' />
          <Trans
            components={{
              1: <span className='font-semibold text-(--accent-9)' />,
            }}
            i18nKey='favoriteGamesStats'
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
