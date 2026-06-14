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

async function forceGetEmulatorThumbnail(emulator: Nostalgist, resolution: { width: number; height: number }) {
  const source = emulator.getCanvas()
  const { width, height } = source
  let sw: number
  let sh: number
  let sx: number
  let sy: number
  if (width / height > resolution.width / resolution.height) {
    sh = height
    sw = Math.round(height * (resolution.width / resolution.height))
    sx = Math.round((width - sw) / 2)
    sy = 0
  } else {
    sw = width
    sh = Math.round(width / (resolution.width / resolution.height))
    sx = 0
    sy = Math.round((height - sh) / 2)
  }
  const target = document.createElement('canvas')
  target.width = sw
  target.height = sh
  const context = target.getContext('2d')
  return await new Promise<File>((resolve) => {
    requestAnimationFrame(() => {
      // @ts-expect-error let's assume the context is always available
      context.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh)
      target.toBlob((blob) => {
        if (blob) {
          // @ts-expect-error the returned value will be used as hono client form value
          resolve(blob)
        }
      })
    })
  })
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
      const result = await getStateAndThumbnail(emulator, arg)
      const { state } = result
      let { thumbnail } = result
      if (core === 'mupen64plus_next') {
        thumbnail = await forceGetEmulatorThumbnail(emulator, { height: 3, width: 4 })
      }
      await $post({ form: { core, rom: rom.id, state, thumbnail, type: 'manual' } })
      await Promise.all([reloadStates(), reloadAutoStates()])
    },
  )

  const { isMutating: isSavingAutoState, trigger: saveAutoState } = useSWRMutation('/api/v1/states', async () => {
    if (!emulator || !core || !rom) {
      throw new Error('invalid emulator or core or rom')
    }
    const result = await emulator.saveState()
    const { state } = result
    let { thumbnail } = result
    if (core === 'mupen64plus_next') {
      thumbnail = await forceGetEmulatorThumbnail(emulator, { height: 3, width: 4 })
    }
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
