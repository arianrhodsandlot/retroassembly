import { type CSSProperties, useCallback } from 'react'
import { useFocusIndicatorStyle } from '../atoms.ts'

export function useFocusIndicator() {
  const [focusIndicatorStyle, setFocusIndicatorStyle] = useFocusIndicatorStyle()

  const syncStyle = useCallback(
    function syncFocusIndicatorStyle({ transition = true }: { transition?: boolean } = {}) {
      const { activeElement } = document
      if (activeElement instanceof HTMLElement && activeElement.dataset.snEnabled) {
        const { height, left, top, width } = activeElement.getBoundingClientRect()
        const focusIndicatorStyle: CSSProperties = { height, left, top, width }
        if (transition) {
          focusIndicatorStyle.transitionProperty = 'all'
          focusIndicatorStyle.transitionDuration = '0.2s'
        }
        try {
          const customStyle = activeElement.dataset.snFocusStyle
          if (customStyle) {
            Object.assign(focusIndicatorStyle, JSON.parse(customStyle))
          }
        } catch {}
        setFocusIndicatorStyle(focusIndicatorStyle)
      } else {
        setFocusIndicatorStyle({})
      }
    },
    [setFocusIndicatorStyle],
  )
  return { style: focusIndicatorStyle, syncStyle }
}
