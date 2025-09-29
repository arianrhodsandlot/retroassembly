import { useSyncExternalStore } from 'react'
import { useLoaderData } from 'react-router'

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

export function useViewport() {
  const { isLikelyDesktop } = useLoaderData()
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isLargeScreen = width >= 1024
  const isNotLargeScreen = !isLargeScreen

  function getServerSnapshot() {
    return isLikelyDesktop ? 1024 : 0
  }

  return {
    isLargeScreen,
    isNotLargeScreen,
    width,
  }
}
