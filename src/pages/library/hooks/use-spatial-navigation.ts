import { useEventListener } from '@react-hookz/web'
import { off, on } from 'delegated-events'
import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'
import { Gamepad } from '@/utils/gamepad.ts'
import { useEmulatorLaunched, useShowGameOverlayContent, useSpatialNavigationPaused } from '../atoms.ts'
import { useMouseIdle } from '../platform/rom/hooks/use-mouse-idle.ts'
import { getKeyNameFromCode } from '../utils/keyboard.ts'
import { cancel, click, focus, init, move } from '../utils/spatial-navigation.ts'
import { useFocusIndicator } from './use-focus-indicator.ts'
import { useInputMapping } from './use-input-mapping.ts'
import { usePreference } from './use-preference.ts'

export function useSpatialNavigation() {
  const { state } = useNavigation()
  const inputMapping = useInputMapping()
  const { syncStyle } = useFocusIndicator()
  const isIdle = useMouseIdle(100)
  const [emulatorLaunched] = useEmulatorLaunched()
  const [showGameOverlay] = useShowGameOverlayContent()
  const [spatialNavigationPaused] = useSpatialNavigationPaused()
  const { preference } = usePreference()

  const isNavigating = state === 'loading'
  const isPlaying = emulatorLaunched && !showGameOverlay
  const isSpatialNavigationPaused = isNavigating || isPlaying || spatialNavigationPaused

  const { showFocusIndicators } = preference.ui

  const [pristine, setPristine] = useState(
    {
      always: false,
      auto: true,
      never: false,
    }[showFocusIndicators],
  )

  useEffect(init, [])

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
      if (isSpatialNavigationPaused) {
        return
      }
      const keyName = getKeyNameFromCode(event.code)
      const direction = keyboardDirectionMap[keyName]
      if (direction) {
        event.preventDefault()
        setPristine(showFocusIndicators === 'never')
        move(direction)
      } else if (keyName === inputMapping.confirmKey || keyName === 'enter' || keyName === 'space') {
        event.preventDefault()
        click(document.activeElement)
      } else if (keyName === inputMapping.cancelKey) {
        event.preventDefault()
        cancel()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [
    inputMapping.keyboard,
    inputMapping.confirmKey,
    inputMapping.cancelKey,
    isSpatialNavigationPaused,
    showFocusIndicators,
  ])

  // gamepad navigation
  useEffect(() => {
    const gamepadDirectionMap = {
      [inputMapping.gamepad.input_player1_down_btn]: 'down',
      [inputMapping.gamepad.input_player1_left_btn]: 'left',
      [inputMapping.gamepad.input_player1_right_btn]: 'right',
      [inputMapping.gamepad.input_player1_up_btn]: 'up',
    } as const

    return Gamepad.onPress(({ button }) => {
      if (isSpatialNavigationPaused) {
        return
      }
      const direction = gamepadDirectionMap[button]
      if (direction) {
        setPristine(showFocusIndicators === 'never')
        move(gamepadDirectionMap[button])
      } else if (`${button}` === inputMapping.confirmButton) {
        click(document.activeElement)
      } else if (`${button}` === inputMapping.cancelButton) {
        cancel()
      }
    })
  }, [
    inputMapping.gamepad,
    inputMapping.confirmButton,
    inputMapping.cancelButton,
    isSpatialNavigationPaused,
    showFocusIndicators,
  ])

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

  return { pristine }
}
