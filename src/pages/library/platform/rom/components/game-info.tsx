import { DateTime } from 'luxon'
import { platformMap } from '@/constants/platform.ts'
import { GameInfoDialog } from './game-info-dialog/game-info-dialog.tsx'

const unknown = <span className='opacity-40'>Unknown</span>

export function GameInfo({ rom }) {
  const launchboxGame = rom.launchboxGame || {}
  const rawReleaseDate = rom.gameReleaseDate ?? launchboxGame.releaseDate
  const releaseDateValue =
    (rawReleaseDate ? DateTime.fromJSDate(new Date(rawReleaseDate)).setZone('utc').toISODate() : '') ||
    rom.gameReleaseYear ||
    launchboxGame.releaseYear
  const releaseDate = new Date(`${releaseDateValue}`)
  const releaseDateTime = DateTime.fromJSDate(releaseDate, { zone: 'utc' })
  const relativeReleaseDate = releaseDateTime.isValid ? releaseDateTime.toRelative({ locale: 'en' }) : null

  const items = [
    {
      icon: 'icon-[mdi--computer-classic]',
      name: '',
      title: 'Platform',
      value: platformMap[rom.platform].displayName,
    },
    {
      icon: 'icon-[mdi--calendar]',
      name: 'gameReleaseDate',
      title: 'Released',
      value: releaseDateValue ? (
        <>
          {releaseDateValue}
          <span className='ml-1.5 text-xs opacity-50'>{relativeReleaseDate}</span>
        </>
      ) : (
        unknown
      ),
    },
    {
      icon: 'icon-[mdi--tag-multiple]',
      name: 'gameGenres',
      title: 'Genres',
      value: (rom.gameGenres ?? launchboxGame.genres)?.trim() || unknown,
    },
    {
      icon: 'icon-[mdi--person-multiple]',
      name: 'gamePlayers',
      title: 'Players',
      value: rom.gamePlayers ?? launchboxGame.maxPlayers ?? unknown,
    },
    {
      icon: 'icon-[mdi--chip]',
      name: 'gameDeveloper',
      title: 'Developer',
      value: (rom.gameDeveloper ?? launchboxGame.developer)?.trim() || unknown,
    },
    {
      icon: 'icon-[mdi--earth]',
      name: 'gamePublisher',
      title: 'Publisher',
      value: (rom.gamePublisher ?? launchboxGame.publisher)?.trim() || unknown,
    },
  ]

  return (
    <div className='bg-(--gray-a3) rounded p-4 lg:px-8'>
      <div className='flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:*:min-w-36'>
        {items.map((item) => (
          <div className='group' key={item.title}>
            <div className='flex items-center justify-between gap-2 font-semibold lg:justify-start'>
              <span className='inline-flex items-center gap-2'>
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
