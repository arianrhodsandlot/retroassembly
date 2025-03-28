'use client'
import { Skeleton } from '@radix-ui/themes'
import { Link } from 'waku'
import { getRomGoodcodes } from '@/utils/library.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'
import { GameEntryContextMenu } from './game-entry-context-menu.tsx'
import { GamePlatform } from './game-platform.tsx'
import { GameTitle } from './game-title.tsx'

export function GameEntry({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <GameEntryContextMenu rom={rom}>
      <Link
        className='game-entry flex flex-col items-center justify-center gap-1 p-1'
        data-sn-enabled
        title={rom.fileName}
        to={`/library/rom/${encodeURIComponent(rom.id)}`}
      >
        {isLoading ? (
          <div className='!w-9/10 aspect-square'>
            <Skeleton className='!size-full' loading />
          </div>
        ) : null}
        {cover?.src ? (
          <img
            alt={goodcodes.rom}
            className='!w-9/10 aspect-square rounded object-contain object-bottom drop-shadow-lg'
            loading='lazy'
            src={cover.src}
          />
        ) : null}

        <GamePlatform platform={rom.platform} />
        <GameTitle rom={rom} />
      </Link>
    </GameEntryContextMenu>
  )
}
