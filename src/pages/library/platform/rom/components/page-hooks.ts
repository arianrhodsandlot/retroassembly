import { useDebouncedCallback, useEventListener } from '@react-hookz/web'
import { useLayoutEffect } from 'react'
import { useNavigation } from 'react-router'
import { useEmulator } from '../hooks/use-emulator.ts'

export function PageHooks(): undefined {
  const navigation = useNavigation()
  const { emulator, exit } = useEmulator()

  const updateEmulatorSizeLazy = useDebouncedCallback(
    () => {
      emulator?.resize({ height: innerHeight, width: innerWidth })
    },
    [emulator],
    100,
  )

  useEventListener(globalThis, 'resize', updateEmulatorSizeLazy)
  useEventListener(globalThis.screen?.orientation, 'change', updateEmulatorSizeLazy)

  useLayoutEffect(() => {
    if (navigation.state === 'loading') {
      exit()
    }
  }, [exit, navigation.state])
}
