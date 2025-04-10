import { useDebouncedCallback, useEventListener } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { settingsDialogOpenAtom } from '@/pages/library/atoms.ts'
import { useInputMapping } from '@/pages/library/hooks/use-input-mapping.ts'
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

  useEventListener(globalThis, 'resize', updateEmulatorSizeLazy)
  useEventListener(globalThis.screen?.orientation, 'change', updateEmulatorSizeLazy)
}
