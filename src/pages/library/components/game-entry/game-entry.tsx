import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import { AnimatePresence, motion } from 'motion/react'
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

  const segments = [libraryPath, 'platform', rom.platform, 'rom', rom.fileName]
  const url = `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`

  return (
    <GameEntryContextMenu rom={rom}>
      <NavigatableLink
        className='game-entry flex flex-col items-center justify-center gap-1 lg:p-1'
        title={rom.fileName}
        to={url}
      >
        <div className='!w-9/10 relative flex aspect-square items-center justify-center overflow-hidden'>
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                animate={{ opacity: 1 }}
                className='absolute inset-0'
                exit={{ opacity: 0 }}
                initial={{ opacity: 1 }}
              >
                <Skeleton className='!size-full' loading />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {cover?.src ? (
            <Atropos activeOffset={0} className='!size-full' shadow={false}>
              <img
                alt={goodcodes.rom}
                className='size-full rounded object-contain object-bottom'
                loading='lazy'
                src={cover.src}
              />
            </Atropos>
          ) : null}
        </div>

        <GamePlatform platform={rom.platform} />
        <GameTitle rom={rom} />
      </NavigatableLink>
    </GameEntryContextMenu>
  )
}
