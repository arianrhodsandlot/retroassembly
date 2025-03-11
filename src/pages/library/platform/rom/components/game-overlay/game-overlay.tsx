'use client'
import { useKeyboardEvent } from '@react-hookz/web'
import { AnimatePresence, motion } from 'motion/react'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButtons } from './game-overlay-buttons.tsx'
import { GameStates } from './game-states.tsx'

export function GameOverlay() {
  const { show, toggle } = useGameOverlay()
  const { emulator } = useEmulator()
  const { reloadStates } = useGameStates()

  useKeyboardEvent(true, (event) => {
    const isEscapeKey = event.key === 'Escape'
    const status = emulator?.getStatus()
    if (isEscapeKey) {
      if (status === 'running') {
        emulator?.pause()
        toggle()
        reloadStates()
      }
      if (status === 'paused') {
        emulator?.resume()
        toggle()
      }
    }
  })

  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden'>
      <AnimatePresence>
        {show ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className='bg-linear-to-b pointer-events-auto absolute inset-0 z-10 flex h-screen w-screen flex-col bg-black/70 text-white'
            exit={{ opacity: 0, scale: 1.1 }}
            initial={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className='bg-linear-to-b to-text-transparent h-32 w-full from-black' />
            <div className='w-6xl mx-auto flex flex-1 flex-col gap-8'>
              <div className='flex gap-8'>
                <GameOverlayButtons />
              </div>
              <GameStates />
            </div>
            <div className='bg-linear-to-b h-32 w-full from-transparent to-black text-transparent' />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
