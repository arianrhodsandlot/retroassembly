import { delay } from 'es-toolkit'
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
    if (emulator) {
      const status = emulator.getStatus()
      if (status === 'running' || status === 'paused') {
        emulator.pause()
        setVisible(true)
        await reloadStates()
      }
    }
  }

  async function hide() {
    if (isPending) {
      return
    }
    setVisible(false)
    focus('canvas')
    await delay(100)
    emulator?.resume()
  }

  async function toggle() {
    await (visible ? hide() : show())
  }

  return { hide, isPending, setIsPending, show, toggle, visible }
}
