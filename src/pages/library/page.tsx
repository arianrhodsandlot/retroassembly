import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library.tsx'
import { GameListMain } from './components/game-list-main.tsx'
import LibraryLayout from './components/library-layout/library-layout.tsx'
import { PageStats } from './components/page-stats.tsx'
import { useIsDemo } from './hooks/use-demo.ts'
import { UploadSelectButton } from './platform/components/upload-select-button.tsx'

export default function LibraryPage() {
  const { t } = useTranslation()
  const { pagination, platformCount, roms } = useLoaderData<typeof loader>()
  const gameLabel = t('game', { count: pagination.total })
  const platformLabel = t('platform', { count: platformCount })
  const isDemo = useIsDemo()

  if (pagination.current > 1 && roms.length === 0) {
    return <>404</>
  }

  return (
    <LibraryLayout>
      <GameListMain>
        <div>
          <h1 className='text-5xl font-semibold'>{t('Library')}</h1>
          {isDemo ? (
            <div className='text-(--gray-11) mt-4 flex items-start gap-1 text-sm lg:items-center'>
              <span className='icon-[mdi--information-outline] mt-1 shrink-0 lg:mt-0' />
              <span>
                {t('These free (legal) games are all picked from')}{' '}
                <a className='underline' href='https://retrobrews.github.io/' rel='noreferrer noopener' target='_blank'>
                  {t('retrobrews project')}
                </a>{' '}
                {t('for demonstration')}
              </span>
            </div>
          ) : null}
        </div>

        {isDemo ? undefined : (
          <PageStats suffix={<UploadSelectButton />}>
            <span className='icon-[mdi--bar-chart] text-(--color-text)' />
            <Trans
              components={{
                1: <span className='text-(--accent-9) font-semibold' />,
                3: <span className='text-(--accent-9) font-semibold' />,
              }}
              i18nKey='gameStats'
              values={{
                game: gameLabel,
                gameCount: pagination.total,
                platform: platformLabel,
                platformCount,
              }}
            />
          </PageStats>
        )}
      </GameListMain>
    </LibraryLayout>
  )
}
