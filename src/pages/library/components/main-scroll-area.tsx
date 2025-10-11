import { type PropsWithChildren, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { focus, resetFocus } from '../utils/spatial-navigation.ts'

const stateMap = new Map<string, { activeHref: string; scroll: { left: number; top: number } }>()
globalThis.stateMap = stateMap

export function MainScrollArea({ ...props }: PropsWithChildren) {
  const location = useLocation()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      const state = stateMap.get(location.key)
      scrollArea.scrollTo({ behavior: 'instant', left: 0, top: 0, ...state?.scroll })
      if (state?.activeHref) {
        const activeElement = document.querySelector(`a[href='${CSS.escape(state.activeHref)}']`)
        if (activeElement) {
          focus(activeElement)
        }
      }

      if (!scrollArea.contains(document.activeElement)) {
        resetFocus({ force: true })
      }
    }

    return () => {
      const { activeElement } = document
      const state = {
        activeHref: scrollArea?.contains(activeElement) ? activeElement?.getAttribute('href') || '' : '',
        scroll: { left: scrollArea?.scrollLeft || 0, top: scrollArea?.scrollTop || 0 },
      }
      stateMap.set(location.key, state)
    }
  }, [location])

  return <div {...props} className='z-1 relative flex-1 lg:overflow-auto' id='main-scroll-area' ref={scrollAreaRef} />
}
