import { usePreference } from './use-preference.ts'

export function useKeyboardMapping() {
  const { preference } = usePreference()
  return preference.emulator.keyboardMapping
}
