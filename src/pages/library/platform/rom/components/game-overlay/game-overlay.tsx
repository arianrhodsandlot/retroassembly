'use client'
import { useKeyboardEvent } from '@react-hookz/web'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { Gamepad } from '@/utils/gamepad.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButtons } from './game-overlay-buttons.tsx'
import { GameStates } from './game-states.tsx'

export function GameOverlay({ rom }) {
  const { show, toggle } = useGameOverlay()
  const { emulator } = useEmulator()
  const { reloadStates } = useGameStates()
  const gamepadMapping = useGamepadMapping()

  const goodcodes = getRomGoodcodes(rom)
  const { data: cover } = useRomCover(rom)

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

  useEffect(
    () =>
      Gamepad.onPress((event) => {
        const { buttons } = event.gamepad
        const expectedButtons = [gamepadMapping.input_player1_l1_btn, gamepadMapping.input_player1_r1_btn]
        const areExpectedButtonPressed = expectedButtons.every((code) => buttons[code].pressed)
        if (areExpectedButtonPressed) {
          toggle()
        }
      }),
    [gamepadMapping, toggle],
  )

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
              <div className='flex items-center gap-4'>
                <div className='size-30 shrink-0'>
                  {cover ? (
                    <img alt={goodcodes.rom} className='size-30 object-contain object-center' src={cover.src} />
                  ) : null}
                </div>
                <div className='text-3xl font-semibold'>{goodcodes.rom}</div>
              </div>
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
