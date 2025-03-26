import { useMemo } from 'react'
import { useGamepadMapping } from './use-gamepad-mapping.ts'
import { useKeyboardMapping } from './use-keyboard-mapping.ts'

export function useInputMapping() {
  const gamepadMapping = useGamepadMapping()
  const keyboardMapping = useKeyboardMapping()
  const mapping = useMemo(
    () => ({ gamepad: gamepadMapping, keyboard: keyboardMapping }),
    [gamepadMapping, keyboardMapping],
  )
  return mapping
}
