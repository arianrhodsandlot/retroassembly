import ky from 'ky'
import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { useEmulator } from './use-emulator.ts'

export function useGameStates() {
  const { core, emulator, rom } = useEmulator()

  const {
    data: states,
    isLoading: isStatesLoading,
    mutate: reloadStates,
  } = useSWRImmutable(`/api/v1/rom/${rom.id}/states`, (url) => ky(url).json())

  const { isMutating: isSavingState, trigger: saveState } = useSWRMutation('/api/v1/state/new', async (url) => {
    if (!emulator || !core) {
      throw new Error('invalid emulator or core')
    }
    const { state, thumbnail } = await emulator.saveState()
    const formData = new FormData()
    formData.append('state', state)
    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }
    formData.append('rom', rom.id)
    formData.append('core', core)
    formData.append('type', 'manual')
    await ky.put(url, { body: formData })
    await reloadStates()
  })

  return { isSavingState, isStatesLoading, reloadStates, saveState, states }
}
