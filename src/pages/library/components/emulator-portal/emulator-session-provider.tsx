import { createContext, type ReactNode, useContext, useReducer } from 'react'
import { useGamepadMapping, type GamepadMapping } from '#@/pages/library/hooks/use-gamepad-mapping.ts'

const EmulatorGamepadMappingContext = createContext<GamepadMapping | null>(null)

export function EmulatorSessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const gamepadMapping = useGamepadMapping()
  const [emulatorGamepadMapping] = useReducer((mapping: GamepadMapping) => mapping, gamepadMapping)

  return (
    <EmulatorGamepadMappingContext.Provider value={emulatorGamepadMapping}>
      {children}
    </EmulatorGamepadMappingContext.Provider>
  )
}

export function useEmulatorGamepadMapping() {
  const gamepadMapping = useContext(EmulatorGamepadMappingContext)
  if (!gamepadMapping) {
    throw new Error('useEmulatorGamepadMapping must be used within EmulatorSessionProvider')
  }

  return gamepadMapping
}
