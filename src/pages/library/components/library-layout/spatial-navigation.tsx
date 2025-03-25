'use client'
import { Portal, Theme } from '@radix-ui/themes'
import { useEventListener, useResizeObserver } from '@react-hookz/web'
import { type CSSProperties, type ReactNode, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import useSWRImmutable from 'swr/immutable'
import { Gamepad } from '@/utils/gamepad.ts'
import { useGamepadMapping } from '../../hooks/use-gamepad-mapping.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { useMouseIdle } from '../../platform/rom/hooks/use-mouse-idle.ts'
import { getKeyNameFromCode } from '../../utils/keyboard.ts'

export function SpatialNavigation({ children }: { children?: ReactNode }) {
  const { data: navi } = useSWRImmutable('js-spatial-navigation', () => import('js-spatial-navigation'))
  const { data: delegatedEvents } = useSWRImmutable('delegated-events', () => import('delegated-events'))
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [activeElement, setActiveElement] = useState<Element | null>(null)
  const [focusIndicatorStyle, setFocusIndicatorStyle] = useState<CSSProperties>({})
  const isIdle = useMouseIdle()

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
        event.preventDefault()
        navi?.move(direction)
        if (document.activeElement) {
          scrollIntoView(document.activeElement, { behavior: 'instant', scrollMode: 'if-needed' })
        }
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
        if (document.activeElement) {
          scrollIntoView(document.activeElement, { behavior: 'smooth', scrollMode: 'always' })
        }
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
      if (isIdle) {
        return
      }
      const target = event.currentTarget
      if (!(target instanceof HTMLAnchorElement) && !(target instanceof HTMLButtonElement)) {
        return
      }
      if (target === document.activeElement) {
        return
      }

      target.focus({ preventScroll: true })
    }
    on(eventName, selector, handleMouseOver)

    return () => {
      off(eventName, selector, handleMouseOver)
    }
  }, [delegatedEvents, isIdle])

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
        const focusIndicatorStyle = {
          backgroundColor: activeElement?.dataset?.highlightColor ?? 'var(--accent-a5)',
          height: height + 10,
          left: left - 5,
          top: top - 5,
          width: width + 10,
        }
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
      <Theme accentColor='red'>
        <div
          className='z-9999 pointer-events-none fixed rounded transition-all duration-300'
          style={focusIndicatorStyle}
        >
          {children}
        </div>
      </Theme>
    </Portal>
  )
}
