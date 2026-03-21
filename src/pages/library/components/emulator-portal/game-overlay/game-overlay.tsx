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

  const handleGamepadPress = useEffectEvent(async (event: { gamepad: Gamepad; button: number }) => {
    const { buttons } = event.gamepad
    const buttonNameMap = {
      L1: gamepadMapping.input_player1_l1_btn,
      L2: gamepadMapping.input_player1_l2_btn,
      L3: gamepadMapping.input_player1_l3_btn,
      R1: gamepadMapping.input_player1_r1_btn,
      R2: gamepadMapping.input_player1_r2_btn,
      R3: gamepadMapping.input_player1_r3_btn,
      Select: gamepadMapping.input_player1_select_btn,
      Start: gamepadMapping.input_player1_start_btn,
    }
    const expectedButtons = gamepadMapping.$pause.split(/\s+\+\s/).map((buttonName) => buttonNameMap[buttonName])
    const areExpectedButtonPressed = expectedButtons.every((code) => buttons[code].pressed)
    if (areExpectedButtonPressed) {
      await toggle()
    }
  })

  useEffect(() => Gamepad.onPress(handleGamepadPress), [])

  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden text-white *:pointer-events-auto *:absolute *:inset-0'>
      <GameOverlayController />
      <GameOverlayVirtualGamepad />
      <GameOverlayContent />
    </div>
  )
}
