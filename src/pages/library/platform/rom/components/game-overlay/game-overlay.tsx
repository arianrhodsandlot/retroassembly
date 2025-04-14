import { debounce } from 'es-toolkit'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { Gamepad } from '@/utils/gamepad.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { GameOverlayContent } from './game-overlay-content.tsx'
import { GameOverlayController } from './game-overlay-controller.tsx'

export function GameOverlay() {
  const { show, toggle } = useGameOverlay()
  const gamepadMapping = useGamepadMapping()

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const isEscapeKey = event.key === 'Escape'
      if (isEscapeKey) {
        event.preventDefault()
        toggle()
      }
    }
    document.body.addEventListener('keydown', handleKeydown)
    return () => document.body.removeEventListener('keydown', handleKeydown)
  }, [toggle])

  useEffect(
    () =>
      Gamepad.onPress(
        debounce((event) => {
          const { buttons } = event.gamepad
          const expectedButtons = [gamepadMapping.input_player1_l1_btn, gamepadMapping.input_player1_r1_btn]
          const areExpectedButtonPressed = expectedButtons.every((code) => buttons[code].pressed)
          if (areExpectedButtonPressed) {
            toggle()
          }
        }, 100),
      ),
    [gamepadMapping, toggle],
  )

  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden'>
      <AnimatePresence>{show ? <GameOverlayContent /> : <GameOverlayController />}</AnimatePresence>
    </div>
  )
}
