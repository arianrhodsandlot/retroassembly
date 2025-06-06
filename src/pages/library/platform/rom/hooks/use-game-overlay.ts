import { useAtom } from 'jotai'
import { useShowGameOverlayContent } from '@/pages/library/atoms.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { isGameOverlayPendingAtom } from '../atoms.ts'
import { useEmulator } from './use-emulator.ts'
import { useGameStates } from './use-game-states.ts'

export function useGameOverlay() {
  const [visible, setVisible] = useShowGameOverlayContent()
  const [isPending, setIsPending] = useAtom(isGameOverlayPendingAtom)
  const { emulator } = useEmulator()
  const { reloadStates } = useGameStates()

  async function show() {
    emulator?.pause()
    setVisible(true)
    await reloadStates()
  }

  function hide() {
    if (isPending) {
      return
    }
    emulator?.resume()
    setVisible(false)
    focus('canvas')
  }

  async function toggle() {
    if (visible) {
      hide()
    } else {
      await show()
    }
  }

  return { hide, isPending, setIsPending, show, toggle, visible }
}
