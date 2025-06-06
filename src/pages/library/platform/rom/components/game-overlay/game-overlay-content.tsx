import { AnimatePresence, motion } from 'motion/react'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { GameInputMessage } from './game-input-message.tsx'
import { GameOverlayButtons } from './game-overlay-buttons.tsx'
import { GameStates } from './game-states.tsx'

function handleAnimationComplete(animation) {
  if (animation.opacity === 1) {
    focus('.game-overlay button')
  }
}

export function GameOverlayContent() {
  const rom = useRom()
  if (!rom) {
    throw new Error('No rom found')
  }
  const { visible } = useGameOverlay()
  const goodcodes = getRomGoodcodes(rom)
  const { data: cover } = useRomCover(rom)
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className='game-overlay flex flex-col bg-black/70'
          exit={{ opacity: 0, scale: 1.1 }}
          initial={{ opacity: 0, scale: 1.1 }}
          onAnimationComplete={handleAnimationComplete}
          transition={{ duration: 0.2 }}
        >
          <div className='bg-linear-to-b to-text-transparent h-4 w-full from-black lg:h-32' />

          <div className='lg:w-6xl flex w-full flex-1 flex-col gap-8 overflow-auto px-4 lg:mx-auto lg:px-0'>
            <div className='hidden items-center gap-4 lg:flex'>
              <div className='size-30 shrink-0'>
                {cover ? (
                  <img alt={goodcodes.rom} className='size-30 object-contain object-center' src={cover.src} />
                ) : null}
              </div>
              <div className='text-3xl font-semibold'>{goodcodes.rom}</div>
            </div>
            <div className='game-overlay-buttons flex flex-col gap-8 lg:flex-row'>
              <GameOverlayButtons />
            </div>
            <GameStates />
          </div>

          <div className='bg-linear-to-b h-4 w-full from-transparent to-black text-transparent lg:h-32' />

          <div className='absolute bottom-0 hidden h-20 w-full flex-1 items-center justify-end gap-4 px-4 lg:flex'>
            <GameInputMessage />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
