import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { useEmulator } from './use-emulator.ts'

export function useGameStates() {
  const { core, emulator, rom } = useEmulator()

  const {
    data: states,
    isMutating: isStatesLoading,
    trigger: reloadStates,
  } = useSWRMutation('/api/v1/states', (url) => ky(url, { searchParams: { rom_id: rom.id } }).json())

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
    formData.append('rom_id', rom.id)
    formData.append('core', core)
    formData.append('type', 'manual')
    await ky.post(url, { body: formData })
    await reloadStates()
  })

  return { isSavingState, isStatesLoading, reloadStates, saveState, states }
}
