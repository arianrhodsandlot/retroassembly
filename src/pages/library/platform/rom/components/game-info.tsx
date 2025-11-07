import { useTranslation } from 'react-i18next'
import { platformMap } from '@/constants/platform.ts'
import { useDate } from '@/pages/library/hooks/use-date.ts'
import { GameInfoDialog } from './game-info-dialog/game-info-dialog.tsx'

export function GameInfo({ rom }) {
  const { t } = useTranslation()
  const { formatDate, formatDateRelative, isValidDate } = useDate()
  const launchboxGame = rom.launchboxGame || {}

  const unknown = <span className='opacity-40'>{t('Unknown')}</span>

  const releaseDate = rom.gameReleaseDate ?? launchboxGame.releaseDate

  const items = [
    {
      icon: 'icon-[mdi--computer-classic]',
      name: '',
      title: t('platform'),
      value: t(platformMap[rom.platform].displayName),
    },
    {
      icon: 'icon-[mdi--calendar]',
      name: 'gameReleaseDate',
      title: t('Released'),
      value: isValidDate(releaseDate) ? (
        <>
          {formatDate(releaseDate)}
          <span className='ml-1.5 text-xs opacity-50'>{formatDateRelative(releaseDate)}</span>
        </>
      ) : (
        unknown
      ),
    },
    {
      icon: 'icon-[mdi--tag-multiple]',
      name: 'gameGenres',
      title: t('Genres'),
      value: (rom.gameGenres ?? launchboxGame.genres)?.trim() || unknown,
    },
    {
      icon: 'icon-[mdi--person-multiple]',
      name: 'gamePlayers',
      title: t('Players'),
      value: rom.gamePlayers ?? launchboxGame.maxPlayers ?? unknown,
    },
    {
      icon: 'icon-[mdi--chip]',
      name: 'gameDeveloper',
      title: t('Developer'),
      value: (rom.gameDeveloper ?? launchboxGame.developer)?.trim() || unknown,
    },
    {
      icon: 'icon-[mdi--earth]',
      name: 'gamePublisher',
      title: t('Publisher'),
      value: (rom.gamePublisher ?? launchboxGame.publisher)?.trim() || unknown,
    },
  ]

  return (
    <div className='bg-(--gray-a3) rounded p-4 lg:px-8'>
      <div className='flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:*:min-w-36'>
        {items.map((item) => (
          <div className='group' key={item.title}>
            <div className='flex items-center justify-between gap-2 font-semibold lg:justify-start'>
              <span className='inline-flex items-center gap-2 capitalize'>
                <span className={item.icon} />
                {item.title}
              </span>
              {item.name ? <GameInfoDialog autoFocusField={item.name} /> : null}
            </div>
            <div className='pl-6'>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
