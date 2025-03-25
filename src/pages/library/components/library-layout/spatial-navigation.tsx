'use client'
import { Portal } from '@radix-ui/themes'
import { useEventListener, useResizeObserver } from '@react-hookz/web'
import { motion } from 'motion/react'
import { type CSSProperties, type ReactNode, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { Gamepad } from '@/utils/gamepad.ts'
import { useGamepadMapping } from '../../hooks/use-gamepad-mapping.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { getKeyNameFromCode } from '../../utils/keyboard.ts'

export function SpatialNavigation({ children }: { children?: ReactNode }) {
  const { data: navi } = useSWRImmutable('js-spatial-navigation', () => import('js-spatial-navigation'))
  const { data: delegatedEvents } = useSWRImmutable('delegated-events', () => import('delegated-events'))
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [activeElement, setActiveElement] = useState<Element | null>(null)
  const [focusIndicatorStyle, setFocusIndicatorStyle] = useState<CSSProperties>({})

  useEffect(() => {
    if (!navi) {
      return
    }

    const { add, init, set, uninit } = navi
    set({ keyMapping: {} })
    init()
    add({ selector: 'a, button' })

    return () => {
      uninit()
    }
  }, [navi])

  useEffect(() => {
    const keyboardMapping = preference?.emulator.keyboardMapping
    const keyboardDirectionMap = {
      [keyboardMapping.input_player1_down]: 'down',
      [keyboardMapping.input_player1_left]: 'left',
      [keyboardMapping.input_player1_right]: 'right',
      [keyboardMapping.input_player1_up]: 'up',
    }

    function handleKeydown(event: KeyboardEvent) {
      const keyName = getKeyNameFromCode(event.code)
      const direction = keyboardDirectionMap[keyName]
      if (direction) {
        navi?.move(direction)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [navi, preference?.emulator.keyboardMapping])

  useEffect(() => {
    const gamepadDirectionMap = {
      [gamepadMapping.input_player1_down_btn]: 'down',
      [gamepadMapping.input_player1_left_btn]: 'left',
      [gamepadMapping.input_player1_right_btn]: 'right',
      [gamepadMapping.input_player1_up_btn]: 'up',
    }

    return Gamepad.onPress(({ button }) => {
      const direction = gamepadDirectionMap[button]
      if (direction) {
        navi?.move(direction)
      }
    })
  }, [navi, gamepadMapping])

  useEffect(() => {
    if (!delegatedEvents) {
      return
    }

    const { off, on } = delegatedEvents
    const eventName = 'mouseover'
    const selectors = ['a', 'button']
    const filters = [':not(:disabled)', ':not([disabled])', ':not(.disabled)']
    const selector = selectors.flatMap((selector) => filters.map((filter) => `${selector}${filter}`)).join(',')
    function handleMouseOver(event: Event) {
      const target = event.currentTarget
      if (!(target instanceof HTMLAnchorElement) && !(target instanceof HTMLButtonElement)) {
        return
      }
      if (target === document.activeElement) {
        return
      }

      target.focus({
        preventScroll: true,
      })
    }
    on(eventName, selector, handleMouseOver)

    return () => {
      off(eventName, selector, handleMouseOver)
    }
  }, [delegatedEvents])

  useEffect(() => {
    function handleActiveElementChange() {
      setActiveElement(document.activeElement)
    }

    document.addEventListener('focus', handleActiveElementChange, true)

    return () => {
      document.removeEventListener('focus', handleActiveElementChange, true)
    }
  }, [])

  const syncFocusIndicatorStyle = useCallback(
    function syncFocusIndicatorStyle() {
      if (activeElement) {
        const { height, left, top, width } = activeElement.getBoundingClientRect()
        const focusIndicatorStyle = { height: height + 20, left: left - 10, top: top - 10, width: width + 20 }
        setFocusIndicatorStyle(focusIndicatorStyle)
      } else {
        setFocusIndicatorStyle({})
      }
    },
    [activeElement],
  )

  useLayoutEffect(() => {
    syncFocusIndicatorStyle()
  }, [syncFocusIndicatorStyle])

  useEventListener(globalThis.document?.body, 'scroll', syncFocusIndicatorStyle, true)

  useResizeObserver(activeElement, () => syncFocusIndicatorStyle)

  return (
    <Portal>
      <motion.div
        className='z-9999 pointer-events-none fixed rounded bg-rose-700 opacity-10'
        layout
        style={focusIndicatorStyle}
      >
        {children}
      </motion.div>
    </Portal>
  )
}
