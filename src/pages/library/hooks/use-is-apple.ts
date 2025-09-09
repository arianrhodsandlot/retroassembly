import { noop } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

const appleKeywords = ['mac', 'iphone', 'ipad']

function subscribe() {
  return noop
}

function getSnapshot() {
  const ua = navigator.userAgent.toLowerCase()
  return appleKeywords.some((keyword) => ua.includes(keyword))
}

function getServerSnapshot() {
  return false
}

export function useIsApple() {
  const isApple = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return isApple
}
