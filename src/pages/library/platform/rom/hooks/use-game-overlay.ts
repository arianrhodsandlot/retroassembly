import { useAtom } from 'jotai'
import { isGameOverlayPendingAtom, showGameOverlayAtom } from '../atoms.ts'
import { useEmulator } from './use-emulator.ts'
import { useGameStates } from './use-game-states.ts'

export function useGameOverlay() {
  const [show, setShow] = useAtom(showGameOverlayAtom)
  const [isPending, setIsPending] = useAtom(isGameOverlayPendingAtom)
  const { emulator } = useEmulator()
  const { reloadStates } = useGameStates()

  const status = emulator?.getStatus()

  function toggle() {
    if (isPending) {
      return
    }

    if (status === 'running') {
      emulator?.pause()
      setShow((show) => !show)
      reloadStates()
    } else if (status === 'paused') {
      emulator?.resume()
      setShow((show) => !show)
    }
  }

  return { isPending, setIsPending, show, toggle }
}
