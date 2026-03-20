import { off, on } from 'delegated-events'
import { useEffect, useEffectEvent } from 'react'
import { useNavigation } from 'react-router'
import { Gamepad } from '#@/utils/client/gamepad.ts'
import { useEmulatorLaunched, usePristine, useShowGameOverlayContent, useSpatialNavigationPaused } from '../atoms.ts'
import { useMouseIdle } from '../components/emulator-portal/hooks/use-mouse-idle.ts'
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

  const [pristine, setPristine] = usePristine()

  useEffect(() => {
    const initialPristine = {
      always: false,
      auto: true,
      never: false,
    }[showFocusIndicators]
    if (pristine) {
      setPristine(initialPristine === true)
    }
  }, [pristine, showFocusIndicators, setPristine])

  useEffect(init, [])

  // keyboard navigation
  const handleKeydown = useEffectEvent(async (event: KeyboardEvent) => {
    if (isSpatialNavigationPaused) {
      return
    }
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
    const keyName = getKeyNameFromCode(event.code)
    const direction = keyboardDirectionMap[keyName]
    if (direction) {
      event.preventDefault()
      setPristine(showFocusIndicators === 'never')
      await move(direction)
    } else if (keyName === inputMapping.confirmKey || keyName === 'enter' || keyName === 'space') {
      event.preventDefault()
      click(document.activeElement)
    } else if (keyName === inputMapping.cancelKey || keyName === 'backspace') {
      event.preventDefault()
      cancel()
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    document.addEventListener('keydown', handleKeydown, { signal: abortController.signal })
    return () => abortController.abort()
  }, [])

  // gamepad navigation
  const handleButtonDown = useEffectEvent(async ({ button }: { button: number }) => {
    if (isSpatialNavigationPaused) {
      return
    }
    const gamepadDirectionMap = {
      [inputMapping.gamepad.input_player1_down_btn]: 'down',
      [inputMapping.gamepad.input_player1_left_btn]: 'left',
      [inputMapping.gamepad.input_player1_right_btn]: 'right',
      [inputMapping.gamepad.input_player1_up_btn]: 'up',
    } as const
    const direction = gamepadDirectionMap[button]
    if (direction) {
      setPristine(showFocusIndicators === 'never')
      await move(direction)
    }
  })

  const handleButtonPress = useEffectEvent(({ button }: { button: number }) => {
    if (isSpatialNavigationPaused) {
      return
    }
    if (`${button}` === inputMapping.confirmButton) {
      click(document.activeElement)
    } else if (`${button}` === inputMapping.cancelButton) {
      cancel()
    }
  })

  useEffect(() => {
    const offButtonDown = Gamepad.onButtonDown(handleButtonDown)
    const offButtonPress = Gamepad.onPress(handleButtonPress)

    return () => {
      offButtonDown()
      offButtonPress()
    }
  }, [])

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
  useEffect(() => {
    const abortController = new AbortController()
    const options = { capture: true, signal: abortController.signal }
    document.addEventListener('scroll', () => syncStyle({ transition: false }), options)
    document.addEventListener('focusin', () => syncStyle(), options)
    return () => abortController.abort()
  }, [syncStyle])

  return { pristine }
}
