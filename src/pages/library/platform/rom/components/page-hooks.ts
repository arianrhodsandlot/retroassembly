'use client'
import { useDebouncedCallback, useEventListener, useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { settingsDialogOpenAtom } from '@/pages/library/atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useMouseIdle } from '../hooks/use-mouse-idle.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function PageHooks(): undefined {
  const [settingsDialogOpen] = useAtom(settingsDialogOpenAtom)
  const { emulator, launch } = useEmulator()
  const idle = useMouseIdle(5000)

  const shouldListenKeyboard = settingsDialogOpen === false && emulator?.getStatus() === 'initial'

  const updateEmulatorSizeLazy = useDebouncedCallback(
    () => {
      emulator?.resize({ height: innerHeight, width: innerWidth })
    },
    [emulator],
    3000,
  )

  useEffect(() => {
    if (emulator && emulator.getStatus() !== 'initial') {
      emulator.getCanvas().style.cursor = idle ? 'none' : 'default'
    }
  }, [idle, emulator])

  useKeyboardEvent(true, async (event) => {
    if (!shouldListenKeyboard) {
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
