import { useToggle } from '@react-hookz/web'
import { delay } from 'es-toolkit'
import { useEffect, useRef } from 'react'

export function useMouseIdle(idleTime = 2000) {
  const [isIdle, setIsIdle] = useToggle()
  const abortController = useRef<AbortController>(undefined)

  useEffect(() => {
    async function resetTimer() {
      setIsIdle(false)
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        await delay(idleTime, { signal: abortController.current.signal })
        setIsIdle(true)
      } catch {}
    }

    resetTimer()

    globalThis.addEventListener('mousemove', resetTimer)

    return () => {
      globalThis.removeEventListener('mousemove', resetTimer)
      abortController.current?.abort()
    }
  }, [idleTime, setIsIdle])

  return isIdle
}
