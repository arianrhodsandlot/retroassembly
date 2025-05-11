import { useDebouncedCallback, useEventListener } from '@react-hookz/web'
import { useEffect } from 'react'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useMouseIdle } from '../hooks/use-mouse-idle.ts'

export function PageHooks(): undefined {
  const { emulator } = useEmulator()
  const idle = useMouseIdle()

  const emulatorStatus = emulator?.getStatus()

  const updateEmulatorSizeLazy = useDebouncedCallback(
    () => {
      emulator?.resize({ height: innerHeight, width: innerWidth })
    },
    [emulator],
    100,
  )

  useEffect(() => {
    if (emulator && emulatorStatus !== 'initial') {
      emulator.getCanvas().style.cursor = idle ? 'none' : 'default'
    }
  }, [idle, emulator, emulatorStatus])

  useEventListener(globalThis, 'resize', updateEmulatorSizeLazy)
  useEventListener(globalThis.screen?.orientation, 'change', updateEmulatorSizeLazy)
}
