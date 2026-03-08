import type { Nostalgist } from 'nostalgist'
import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import { useShowGameOverlayContent } from '#@/pages/library/atoms.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { useEmulator } from './use-emulator.ts'

const { $get, $post } = client.states

async function getStateAndThumbnail(emulator: Nostalgist, object: { state?: File; thumbnail?: File } = {}) {
  if (object.state && object.thumbnail) {
    return object as { state: File; thumbnail: File }
  }
  let { state, thumbnail } = object
  if (state) {
    thumbnail = (await emulator.screenshot()) as unknown as File
  } else {
    const result = await emulator.saveState()
    state = result.state as unknown as File
    if (!thumbnail) {
      thumbnail = result.thumbnail as unknown as File
    }
  }
  return { state, thumbnail }
}

export function useGameStates() {
  const rom = useRom()
  const { core, emulator } = useEmulator()
  const [showGameOverlay] = useShowGameOverlayContent()

  const {
    data: manualStates,
    isLoading: isStatesLoading,
    mutate: reloadStates,
  } = useSWRImmutable(
    rom ? { endpoint: '/api/v1/roms/:id/states', query: { rom: rom.id, type: 'manual' } as const } : false,
    ({ query }) => parseResponse($get({ query })),
  )

  const { data: autoStates, mutate: reloadAutoStates } = useSWRImmutable(
    rom ? { endpoint: '/api/v1/roms/:id/states', query: { rom: rom.id, type: 'auto' } as const } : false,
    ({ query }) => parseResponse($get({ query })),
    { dedupingInterval: 0, revalidateOnMount: true },
  )

  const states = [...(manualStates || []), ...(autoStates || [])]

  const { isMutating: isSavingManualState, trigger: saveManualState } = useSWRMutation(
    '/api/v1/states',
    async (_key, { arg = {} }: { arg?: { state?: File; thumbnail?: File } }) => {
      if (!emulator || !core || !rom) {
        throw new Error('invalid emulator or core or rom')
      }
      const { state, thumbnail } = await getStateAndThumbnail(emulator, arg)
      await $post({ form: { core, rom: rom.id, state, thumbnail, type: 'manual' } })
      await Promise.all([reloadStates(), reloadAutoStates()])
    },
  )

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

  return {
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
