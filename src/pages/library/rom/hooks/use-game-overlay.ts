import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { isGameOverlayPendingAtom, showGameOverlayAtom } from '../atoms.ts'
import { useEmulator } from './use-emulator.ts'

export function useGameOverlay() {
  const { emulator } = useEmulator()
  const [show, setShow] = useAtom(showGameOverlayAtom)
  const [isPending, setIsPending] = useAtom(isGameOverlayPendingAtom)

  function toggle() {
    if (!isPending) {
      setShow((show) => !show)
    }
  }

  useKeyboardEvent(true, (event) => {
    const isEscapeKey = event.key === 'Escape'
    const status = emulator?.getStatus()
    if (isEscapeKey) {
      if (status === 'running') {
        emulator?.pause()
        toggle()
      }
      if (status === 'paused') {
        emulator?.resume()
        toggle()
      }
    }
  })

  return { isPending, setIsPending, show, toggle }
}
