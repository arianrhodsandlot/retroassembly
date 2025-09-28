import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  const controller = new AbortController()
  globalThis.addEventListener('resize', callback, { signal: controller.signal })
  return () => {
    controller.abort()
  }
}

function getSnapshot() {
  return globalThis.innerWidth
}

function getServerSnapshot() {
  return 0
}

export function useViewport() {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isHydrated = width !== 0 // 0 is our SSR default
  const isLargeScreen = width >= 1024
  const isNotLargeScreen = !isLargeScreen

  return {
    isHydrated,
    isLargeScreen,
    isNotLargeScreen,
    width,
  }
}
