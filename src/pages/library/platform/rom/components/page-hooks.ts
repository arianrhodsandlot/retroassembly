'use client'
import { useDebouncedCallback, useEventListener, useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { settingsDialogOpenAtom } from '@/pages/library/atoms.ts'
import { useInputMapping } from '@/pages/library/hooks/use-input-mapping.ts'
import { getKeyNameFromCode } from '@/pages/library/utils/keyboard.ts'
import { Gamepad } from '@/utils/gamepad.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useMouseIdle } from '../hooks/use-mouse-idle.ts'

export function PageHooks(): undefined {
  const [settingsDialogOpen] = useAtom(settingsDialogOpenAtom)
  const { emulator } = useEmulator()
  const idle = useMouseIdle()
  const inputMapping = useInputMapping()

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
      Gamepad.onPress(({ button }) => {
        if (!canLaunch) {
          return
        }

        const directionButtons = new Set([
          inputMapping.gamepad.input_player1_down_btn,
          inputMapping.gamepad.input_player1_left_btn,
          inputMapping.gamepad.input_player1_right_btn,
          inputMapping.gamepad.input_player1_up_btn,
        ])
        if (directionButtons.has(`${button}`)) {
          return
        }

        document.querySelector<HTMLButtonElement>('.launch-button')?.click()
      }),
    [inputMapping.gamepad, canLaunch],
  )

  useKeyboardEvent(true, (event) => {
    if (!canLaunch) {
      return
    }

    const directionKeys = new Set([
      'down',
      inputMapping.keyboard.input_player1_down,
      inputMapping.keyboard.input_player1_left,
      inputMapping.keyboard.input_player1_right,
      inputMapping.keyboard.input_player1_up,
      'left',
      'right',
      'up',
    ])

    const keyName = getKeyNameFromCode(event.code)
    const isEscapeKey = event.key === 'Escape'
    const isSpecialKey =
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || isEscapeKey || directionKeys.has(keyName)
    if (isSpecialKey) {
      return
    }

    const isFocusingLaunchButton = document.activeElement?.classList.contains('launch-button')
    if (!isFocusingLaunchButton) {
      if (event.key === 'Enter' || event.key === 'Space') {
        return
      }
      if (keyName === inputMapping.keyboard.input_player1_a) {
        return
      }
    }

    document.querySelector<HTMLButtonElement>('.launch-button')?.click()
  })

  useEventListener(globalThis, 'resize', updateEmulatorSizeLazy)
  useEventListener(globalThis.screen?.orientation, 'change', updateEmulatorSizeLazy)
}
