import ky from 'ky'
import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { useEmulator } from './use-emulator.tsx'

export function useGameStates() {
  const { core, getEmulator, resume, rom } = useEmulator()

  const { data: states, isLoading: isStatesLoading } = useSWRImmutable('/api/v1/states', (url) =>
    ky(url, { searchParams: { rom_id: rom.id } }).json(),
  )

  const { isMutating: isSavingState, trigger: saveState } = useSWRMutation(
    '/api/v1/state/new',
    async (url, { arg: type }: { arg: string }) => {
      const { state, thumbnail } = await getEmulator().saveState()
      const formData = new FormData()
      formData.append('state', state)
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }
      formData.append('rom_id', rom.id)
      formData.append('core', core)
      formData.append('type', type)
      await ky.post(url, { body: formData })
    },
  )

  const { isMutating: isLoadingState, trigger: loadState } = useSWRMutation('', async (url) => {
    const emulator = getEmulator()
    const state = await ky(url).blob()
    await emulator.loadState(state)
    resume()
  })

  return { isLoadingState, isSavingState, isStatesLoading, loadState, saveState, states }
}
