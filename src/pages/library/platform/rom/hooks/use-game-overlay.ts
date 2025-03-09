import { useAtom } from 'jotai'
import { isGameOverlayPendingAtom, showGameOverlayAtom } from '../atoms.ts'

export function useGameOverlay() {
  const [show, setShow] = useAtom(showGameOverlayAtom)
  const [isPending, setIsPending] = useAtom(isGameOverlayPendingAtom)

  function toggle() {
    if (!isPending) {
      setShow((show) => !show)
    }
  }

  return { isPending, setIsPending, show, toggle }
}
