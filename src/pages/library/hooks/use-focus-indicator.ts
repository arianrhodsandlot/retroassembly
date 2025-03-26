import { camelCase, mapKeys, pickBy } from 'es-toolkit'
import { type CSSProperties, useCallback } from 'react'
import { useFocusIndicatorStyle } from '../atoms.ts'

export function useFocusIndicator() {
  const [focusIndicatorStyle, setFocusIndicatorStyle] = useFocusIndicatorStyle()

  const syncStyle = useCallback(
    function syncFocusIndicatorStyle({ transition = true }: { transition?: boolean } = {}) {
      const { activeElement } = document
      if (activeElement instanceof HTMLElement && activeElement !== document.body) {
        const { height, left, top, width } = activeElement.getBoundingClientRect()
        const focusIndicatorStyle: CSSProperties = {
          backgroundColor: 'var(--accent-a5)',
          height: height + 10,
          left: left - 5,
          top: top - 5,
          width: width + 10,
          ...mapKeys(
            pickBy(activeElement.dataset, (_value, key) => `${key}`.startsWith('focus')),
            (_value, key) => camelCase(`${key}`.slice(5)),
          ),
        }

        if (transition) {
          focusIndicatorStyle.transitionProperty = 'all'
          focusIndicatorStyle.transitionDuration = '0.2s'
        }
        setFocusIndicatorStyle(focusIndicatorStyle)
      } else {
        setFocusIndicatorStyle({})
      }
    },
    [setFocusIndicatorStyle],
  )
  return { style: focusIndicatorStyle, syncStyle }
}
