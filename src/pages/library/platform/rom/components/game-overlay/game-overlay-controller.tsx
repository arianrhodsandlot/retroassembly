import { motion } from 'motion/react'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useMouseIdle } from '../../hooks/use-mouse-idle.ts'

export function GameOverlayController() {
  const rom = useRom()
  if (!rom) {
    throw new Error('No rom found')
  }
  const { emulator } = useEmulator()
  const idle = useMouseIdle()
  const { toggle } = useGameOverlay()

  function handleClick() {
    toggle()
  }

  if (idle || emulator?.getStatus() !== 'running') {
    return
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className='game-overlay bg-linear-to-b pointer-events-auto absolute inset-0 z-10 flex h-screen w-screen flex-col items-center justify-center bg-black/70 text-white'
      exit={{ opacity: 0, scale: 1.1 }}
      initial={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className='flex size-16 items-center justify-center rounded-full bg-white text-4xl text-[var(--accent-9)]'
        onClick={handleClick}
        type='button'
      >
        <span className='icon-[mdi--pause]' />
      </button>
    </motion.div>
  )
}
