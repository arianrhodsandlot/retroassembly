import { useEffect, useRef } from 'react'
import { useShowGameOverlayContent, useEmulatorLaunched } from '#@/pages/library/atoms.ts'
import { useIsDemo } from '#@/pages/library/hooks/use-demo.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { useEmulator } from './use-emulator.ts'
import { useGameStates } from './use-game-states.ts'

export function useAutosave() {
  const { emulator } = useEmulator()
  const { preference } = usePreference()
  const { saveAutoState } = useGameStates()
  const isDemo = useIsDemo()
  const showGameOverlay = useShowGameOverlayContent()
  const overlayVisible = showGameOverlay[0]
  const [launched] = useEmulatorLaunched()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const nextSaveAtRef = useRef<number | null>(null)
  const intervalSeconds = preference.emulator.autoSaveInterval
  const isDisabled = intervalSeconds === 0 || isDemo

  useEffect(() => {
    if (isDisabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    if (!launched) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    async function triggerAutosave() {
      const status = emulator?.getStatus()
      if (status !== 'running') {
        return
      }

      try {
        await saveAutoState()
      } catch {}

      const ms = intervalSeconds * 1000
      nextSaveAtRef.current = Date.now() + ms
      timeoutRef.current = setTimeout(triggerAutosave, ms)
    }

    if (overlayVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
        pausedAtRef.current = Date.now()
      }
    } else if (!timeoutRef.current) {
      const delay = (() => {
        if (pausedAtRef.current !== null && nextSaveAtRef.current !== null) {
          const elapsedBeforePause = pausedAtRef.current - (nextSaveAtRef.current - intervalSeconds * 1000)
          const remainingTime = intervalSeconds * 1000 - elapsedBeforePause
          return Math.max(0, remainingTime)
        }
        return intervalSeconds * 1000
      })()

      pausedAtRef.current = null
      nextSaveAtRef.current = Date.now() + delay
      timeoutRef.current = setTimeout(triggerAutosave, delay)
    }
  }, [intervalSeconds, isDisabled, emulator, overlayVisible, saveAutoState, launched])
}
