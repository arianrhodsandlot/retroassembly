import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import { useShowGameOverlayContent } from '#@/pages/library/atoms.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { useEmulator } from './use-emulator.ts'

const { $get, $post } = client.states

export function useGameStates() {
  const rom = useRom()
  const { core, emulator } = useEmulator()
  const [showGameOverlay] = useShowGameOverlayContent()

  const {
    data: manualStates,
    isLoading: isStatesLoading,
    mutate: reloadStates,
  } = useSWRImmutable(
    rom && showGameOverlay
      ? { endpoint: '/api/v1/roms/:id/states', query: { rom: rom.id, type: 'manual' } as const }
      : false,
    ({ query }) => parseResponse($get({ query })),
  )

  const { data: autoStates, mutate: reloadAutoStates } = useSWRImmutable(
    rom && showGameOverlay
      ? { endpoint: '/api/v1/roms/:id/states', query: { rom: rom.id, type: 'auto' } as const }
      : false,
    ({ query }) => parseResponse($get({ query })),
    { dedupingInterval: 0, revalidateOnMount: true },
  )

  const states = [...(manualStates || []), ...(autoStates || [])]

  const { isMutating: isSavingManualState, trigger: saveManualState } = useSWRMutation('/api/v1/states', async () => {
    if (!emulator || !core || !rom) {
      throw new Error('invalid emulator or core or rom')
    }
    const { state, thumbnail } = await emulator.saveState()
    await $post({
      // @ts-expect-error actually we can use Blob here thought it says only File is accepted
      form: { core, rom: rom.id, state, thumbnail, type: 'manual' },
    })
    await reloadStates()
    await reloadAutoStates()
  })

  const { isMutating: isSavingAutoState, trigger: saveAutoState } = useSWRMutation('/api/v1/states', async () => {
    if (!emulator || !core || !rom) {
      throw new Error('invalid emulator or core or rom')
    }
    const { state, thumbnail } = await emulator.saveState()
    await $post({
      // @ts-expect-error actually we can use Blob here thought it says only File is accepted
      form: { core, rom: rom.id, state, thumbnail, type: 'auto' },
    })
    await reloadAutoStates()
  })

  // import an existing .state file (RetroArch format) from disk as a manual save state
  const { isMutating: isImportingSave, trigger: importSave } = useSWRMutation(
    '/api/v1/states',
    async (_key: string, { arg: file }: { arg: File }) => {
      if (!core || !rom) {
        throw new Error('invalid core or rom')
      }
      // capture the current game frame as the thumbnail using the emulator canvas
      const canvas = emulator?.getCanvas()
      if (!canvas) {
        throw new Error('emulator canvas not available')
      }
      const thumbnail = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('canvas.toBlob returned null'))
          }
        }, 'image/png')
      })
      await $post({
        // @ts-expect-error actually we can use Blob here though it says only File is accepted
        form: { core, rom: rom.id, state: file, thumbnail, type: 'manual' },
      })
      await reloadStates()
    },
  )

  return {
    importSave,
    isImportingSave,
    isSavingAutoState,
    isSavingManualState,
    isStatesLoading,
    reloadAutoStates,
    reloadStates,
    saveAutoState,
    saveManualState,
    showGameOverlay,
    states,
  }
}
