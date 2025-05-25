import { AnimatePresence, motion } from 'motion/react'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useMouseIdle } from '../../hooks/use-mouse-idle.ts'
import { GameInputMessage } from './game-input-message.tsx'

export function GameOverlayController() {
  const rom = useRom()
  if (!rom) {
    throw new Error('No rom found')
  }
  const idle = useMouseIdle(3000)
  const { show: showGameOverlay, toggle } = useGameOverlay()
  const [launched] = useEmulatorLaunched()

  function handleClick() {
    toggle()
  }

  const show = launched && !idle && !showGameOverlay

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='hidden flex-col justify-end lg:flex'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className='bg-linear-to-b h-20 from-transparent to-black/40' />
          <div className='bg-linear-to-b flex h-20 w-full items-center from-black/40 to-black/70 px-4'>
            <button
              className='text-(--accent-9) flex size-12 items-center justify-center rounded-full bg-white text-2xl'
              onClick={handleClick}
              title='Pause'
              type='button'
            >
              <span className='icon-[mdi--pause]' />
            </button>
            <div className='hidden flex-1 items-center justify-end gap-4 lg:flex'>
              <GameInputMessage />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
