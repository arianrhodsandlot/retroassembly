import { delay } from 'es-toolkit'
import { useEffect, useRef, useState } from 'react'

const events = ['mousemove', 'click', 'pointerdown', 'touchstart'] as const

export function useMouseIdle(idleTime = 1000) {
  const [isIdle, setIsIdle] = useState(false)
  const abortController = useRef<AbortController>(undefined)

  useEffect(() => {
    const eventAbortController = new AbortController()
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

    for (const event of events) {
      document.body.addEventListener(event, resetTimer, { signal: eventAbortController.signal })
    }

    return () => {
      abortController.current?.abort()
      eventAbortController.abort()
    }
  }, [idleTime, setIsIdle])

  return isIdle
}
