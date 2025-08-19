import { UTCDateMini } from '@date-fns/utc'
import { lightFormat } from 'date-fns'
import { platformMap } from '@/constants/platform.ts'
import { GameInfoDialog } from './game-info-dialog.tsx'

const unknown = <span className='opacity-40'>Unknown</span>

export function GameInfo({ rom }) {
  const launchboxGame = rom.launchboxGame || {}

  const gameInfo = {
    developer: rom.gameDeveloper ?? launchboxGame.developer,
    genres: rom.gameGenres ?? launchboxGame.genres,
    name: rom.gameName ?? launchboxGame.name,
    players: rom.gamePlayers ?? launchboxGame.maxPlayers,
    publisher: rom.gamePublisher ?? launchboxGame.publisher,
    rating: rom.gameRating ?? launchboxGame.rating,
    releaseDate: rom.gameReleaseDate ?? launchboxGame.releaseDate,
    releaseYear: rom.gameReleaseYear ?? launchboxGame.releaseYear,
  }

  return (
    <div className='bg-(--gray-a3) rounded px-8 py-4'>
      <div className='flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:*:min-w-36'>
        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--computer-classic]' />
            Platform
          </div>
          <div className='pl-6'>{platformMap[rom.platform].displayName}</div>
        </div>

        <div className='group'>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--calendar]' />
            Released
            <GameInfoDialog />
          </div>
          <div className='pl-6'>
            {(gameInfo.releaseDate ? lightFormat(new UTCDateMini(gameInfo.releaseDate), 'yyyy-MM-dd') : '') ||
              gameInfo.releaseYear ||
              unknown}
          </div>
        </div>

        <div className='group'>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--tag-multiple]' />
            Genres
            <GameInfoDialog />
          </div>
          <div className='pl-6'>{gameInfo.genres || unknown}</div>
        </div>

        <div className='group'>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--person-multiple]' />
            Players
            <GameInfoDialog />
          </div>
          <div className='pl-6'>
            <span>{gameInfo.players || unknown}</span>
          </div>
        </div>

        <div className='group'>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--chip]' />
            Developer
            <GameInfoDialog />
          </div>
          <div className='pl-6'>{gameInfo.developer || unknown}</div>
        </div>

        <div className='group'>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='icon-[mdi--earth]' />
            Publisher
            <GameInfoDialog />
          </div>
          <div className='pl-6'>{gameInfo.publisher || unknown}</div>
        </div>
      </div>
    </div>
  )
}
