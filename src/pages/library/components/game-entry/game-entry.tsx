import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import { getRomGoodcodes } from '@/utils/library.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'
import { NavigatableLink } from '../navigatable-link.tsx'
import { GameEntryContextMenu } from './game-entry-context-menu.tsx'
import { GamePlatform } from './game-platform.tsx'
import { GameTitle } from './game-title.tsx'

export function GameEntry({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const { data: cover, isLoading } = useRomCover(rom)
  const isDemo = useIsDemo()

  const libraryPath = isDemo ? 'demo' : 'library'

  return (
    <GameEntryContextMenu rom={rom}>
      <NavigatableLink
        className='game-entry flex flex-col items-center justify-center gap-1 p-1'
        title={rom.fileName}
        to={`/${encodeURIComponent(libraryPath)}/platform/${rom.platform}/rom/${encodeURIComponent(rom.fileName)}`}
      >
        {isLoading ? (
          <div className='!w-9/10 aspect-square'>
            <Skeleton className='!size-full' loading />
          </div>
        ) : null}
        {cover?.src ? (
          <Atropos activeOffset={0} innerClassName='!flex items-center justify-center' shadow={false}>
            <img
              alt={goodcodes.rom}
              className='!w-9/10 aspect-square rounded object-contain object-bottom drop-shadow-lg'
              loading='lazy'
              src={cover.src}
            />
          </Atropos>
        ) : null}

        <GamePlatform platform={rom.platform} />
        <GameTitle rom={rom} />
      </NavigatableLink>
    </GameEntryContextMenu>
  )
}
