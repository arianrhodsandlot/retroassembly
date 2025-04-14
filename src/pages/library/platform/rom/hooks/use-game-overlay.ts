import { useAtom } from 'jotai'
import { useShowGameOverlay } from '@/pages/library/atoms.ts'
import { isGameOverlayPendingAtom } from '../atoms.ts'
import { useEmulator } from './use-emulator.ts'
import { useGameStates } from './use-game-states.ts'

export function useGameOverlay() {
  const [show, setShow] = useShowGameOverlay()
  const [isPending, setIsPending] = useAtom(isGameOverlayPendingAtom)
  const { emulator } = useEmulator()
  const { reloadStates } = useGameStates()

  async function toggle() {
    if (isPending) {
      return
    }

    const status = emulator?.getStatus()
    if (status === 'running') {
      emulator?.pause()
      await reloadStates()
    } else if (status === 'paused') {
      emulator?.resume()
    }
    setShow((show) => !show)
  }

  return { isPending, setIsPending, show, toggle }
}
