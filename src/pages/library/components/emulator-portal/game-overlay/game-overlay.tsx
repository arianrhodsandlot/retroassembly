import { debounce } from 'es-toolkit'
import { useEffect, useEffectEvent } from 'react'
import { useGamepadMapping } from '#@/pages/library/hooks/use-gamepad-mapping.ts'
import { useKeyboardMapping } from '#@/pages/library/hooks/use-keyboard-mapping.ts'
import { getKeyNameFromCode } from '#@/pages/library/utils/keyboard.ts'
import { Gamepad } from '#@/utils/client/gamepad.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { GameOverlayContent } from './game-overlay-content.tsx'
import { GameOverlayController } from './game-overlay-controller.tsx'
import { GameOverlayVirtualGamepad } from './game-overlay-virtual-gamepad.tsx'

export function GameOverlay() {
  const keyboardMapping = useKeyboardMapping()
  const gamepadMapping = useGamepadMapping()
  const { toggle } = useGameOverlay()

  const handleKeydown = useEffectEvent(async (event: KeyboardEvent) => {
    if (getKeyNameFromCode(event.code) === keyboardMapping.$pause) {
      event.preventDefault()
      await toggle()
    }
  })

  useEffect(() => {
    const abortController = new AbortController()
    document.body.addEventListener('keydown', handleKeydown, { signal: abortController.signal })
    return () => abortController.abort()
  }, [])

  const handleGamepadPress = useEffectEvent(
    debounce(async (event: { gamepad: Gamepad; button: number }) => {
      const { buttons } = event.gamepad
      const expectedButtons = [gamepadMapping.input_player1_l1_btn, gamepadMapping.input_player1_r1_btn]
      const areExpectedButtonPressed = expectedButtons.every((code) => buttons[code].pressed)
      if (areExpectedButtonPressed) {
        await toggle()
      }
    }, 100),
  )

  useEffect(() => Gamepad.onPress(handleGamepadPress), [])

  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden text-white *:pointer-events-auto *:absolute *:inset-0'>
      <GameOverlayController />
      <GameOverlayVirtualGamepad />
      <GameOverlayContent />
    </div>
  )
}
