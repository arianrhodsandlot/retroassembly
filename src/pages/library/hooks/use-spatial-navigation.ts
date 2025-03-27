import { useEventListener } from '@react-hookz/web'
import { off, on } from 'delegated-events'
import { delay } from 'es-toolkit'
import { useCallback, useEffect } from 'react'
import { useRouter_UNSTABLE } from 'waku'
import { Gamepad } from '@/utils/gamepad.ts'
import { useEmulatorLaunched, useShowGameOverlay } from '../atoms.ts'
import { useMouseIdle } from '../platform/rom/hooks/use-mouse-idle.ts'
import { getKeyNameFromCode } from '../utils/keyboard.ts'
import { cancel, click, focus, init, move, resetFocus } from '../utils/spatial-navigation.ts'
import { useFocusIndicator } from './use-focus-indicator.ts'
import { useInputMapping } from './use-input-mapping.ts'

export function useSpatialNavigation() {
  const router = useRouter_UNSTABLE()
  const inputMapping = useInputMapping()
  const { syncStyle } = useFocusIndicator()
  const isIdle = useMouseIdle(100)
  const [emulatorLaunched] = useEmulatorLaunched()
  const [showGameOverlay] = useShowGameOverlay()

  const moveAsNeeded = useCallback(
    async function moveAsNeeded(...args: Parameters<typeof move>) {
      if (!emulatorLaunched || showGameOverlay) {
        await move(...args)
      }
    },
    [showGameOverlay, emulatorLaunched],
  )

  useEffect(init, [])

  // focus after route navigation incase previously focused element is unmounted
  useEffect(() => {
    if (router.path) {
      ;(async () => {
        await delay(0)
        resetFocus({ force: true })
      })()
    }
  }, [router.path])

  // keyboard navigation
  useEffect(() => {
    const keyboardDirectionMap = {
      [inputMapping.keyboard.input_player1_down]: 'down',
      [inputMapping.keyboard.input_player1_left]: 'left',
      [inputMapping.keyboard.input_player1_right]: 'right',
      [inputMapping.keyboard.input_player1_up]: 'up',

      down: 'down',
      left: 'left',
      right: 'right',
      up: 'up',
    } as const

    function handleKeydown(event: KeyboardEvent) {
      const keyName = getKeyNameFromCode(event.code)
      const direction = keyboardDirectionMap[keyName]
      if (direction) {
        event.preventDefault()
        moveAsNeeded(direction)
      } else if (keyName === inputMapping.keyboard.input_player1_a || keyName === 'enter' || keyName === 'space') {
        event.preventDefault()
        click(document.activeElement)
      } else if (keyName === inputMapping.keyboard.input_player1_b) {
        event.preventDefault()
        cancel()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [inputMapping.keyboard, moveAsNeeded])

  // gamepad navigation
  useEffect(() => {
    const gamepadDirectionMap = {
      [inputMapping.gamepad.input_player1_down_btn]: 'down',
      [inputMapping.gamepad.input_player1_left_btn]: 'left',
      [inputMapping.gamepad.input_player1_right_btn]: 'right',
      [inputMapping.gamepad.input_player1_up_btn]: 'up',
    } as const

    return Gamepad.onPress(({ button }) => {
      const direction = gamepadDirectionMap[button]
      if (direction) {
        moveAsNeeded(gamepadDirectionMap[button])
      } else if (`${button}` === inputMapping.gamepad.input_player1_a_btn) {
        click(document.activeElement)
      } else if (`${button}` === inputMapping.gamepad.input_player1_b_btn) {
        cancel()
      }
    })
  }, [inputMapping.gamepad, moveAsNeeded])

  // focus when an element got hovered
  useEffect(() => {
    const eventName = 'mouseover'
    const selector = '[data-sn-enabled]'

    function handleMouseOver(event: Event) {
      if (!isIdle && event.currentTarget instanceof HTMLElement) {
        focus(event.currentTarget)
      }
    }
    on(eventName, selector, handleMouseOver)

    return () => off(eventName, selector, handleMouseOver)
  }, [isIdle])

  // auto resize or move the focus indicator
  useEventListener(globalThis.document, 'scroll', () => syncStyle({ transition: false }), true)

  // maintain focus status
  useEventListener(globalThis.document, 'focusin', syncStyle, true)
}
