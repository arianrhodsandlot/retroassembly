import ky from 'ky'
import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import type { States } from '@/controllers/get-states.ts'
import { useShowGameOverlayContent } from '@/pages/library/atoms.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useEmulator } from './use-emulator.ts'

const { $post } = client.states

export function useGameStates() {
  const rom = useRom()
  const { core, emulator } = useEmulator()
  const [showGameOverlay] = useShowGameOverlayContent()

  const {
    data: states,
    isLoading: isStatesLoading,
    mutate: reloadStates,
  } = useSWRImmutable(rom && showGameOverlay ? `/api/v1/roms/${rom.id}/states` : false, (url) => ky<States>(url).json())

  const { isMutating: isSavingState, trigger: saveState } = useSWRMutation('/api/v1/states', async (url) => {
    if (!emulator || !core || !rom) {
      throw new Error('invalid emulator or core or rom')
    }
    const { state, thumbnail } = await emulator.saveState()
    await $post({
      // @ts-expect-error actually we can use Blob here thought it says only File is accepted
      form: { core, rom: rom.id, state, thumbnail, type: 'manual' },
    })
    await reloadStates()
  })

  return { isSavingState, isStatesLoading, reloadStates, saveState, states }
}
