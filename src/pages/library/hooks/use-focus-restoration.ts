import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { focus } from '../utils/spatial-navigation.ts'

const stateMap = new Map<string, { activeHref: string }>()

export function useFocusRestoration() {
  const location = useLocation()

  useLayoutEffect(() => {
    const state = stateMap.get(location.key)
    if (state?.activeHref) {
      const activeElement = document.querySelector(`a[href='${CSS.escape(state.activeHref)}']`)
      if (activeElement) {
        focus(activeElement)
      }
    }

    return () => {
      const { activeElement } = document
      const state = {
        activeHref: activeElement?.getAttribute('href') || '',
      }
      stateMap.set(location.key, state)
    }
  }, [location.key])
}
