'use client'
import { useDebouncedCallback, useEventListener, useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { settingsDialogOpenAtom } from '@/pages/library/atoms.ts'
import { Gamepad } from '@/utils/gamepad.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useMouseIdle } from '../hooks/use-mouse-idle.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function PageHooks(): undefined {
  const [settingsDialogOpen] = useAtom(settingsDialogOpenAtom)
  const { emulator, launch } = useEmulator()
  const idle = useMouseIdle()

  const activeElement = globalThis.document?.activeElement
  const isFocusingLaunchButton = activeElement === globalThis.document?.querySelector('main button')
  const hasFocusing = activeElement && ['A', 'BUTTON'].includes(activeElement.tagName)
  const emulatorStatus = emulator?.getStatus()

  const canLaunch =
    (isFocusingLaunchButton || !hasFocusing) && settingsDialogOpen === false && emulator?.getStatus() === 'initial'

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

  useEffect(
    () =>
      Gamepad.onPress(async () => {
        if (canLaunch) {
          await launch()
        }
      }),
    [canLaunch, launch],
  )

  useKeyboardEvent(true, async (event) => {
    if (!canLaunch) {
      return
    }
    const isEscapeKey = event.key === 'Escape'
    const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
    const isDirectionKey = directionKeys.has(event.key)
    const shoudLaunch = !isSpecialKey && !isDirectionKey && !isEscapeKey
    if (shoudLaunch) {
      await launch()
    }
  })

  useEventListener(globalThis, 'resize', updateEmulatorSizeLazy)
  useEventListener(globalThis.screen?.orientation, 'change', updateEmulatorSizeLazy)
}
