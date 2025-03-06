import { Nostalgist } from 'nostalgist'
import useSWRImmutable from 'swr/immutable'
import { usePreference } from '../../hooks/use-preference.ts'
import { useRom } from './use-rom.ts'

export function useEmulator() {
  const rom = useRom()
  const preference = usePreference()
  const romUrl = `/api/v1/rom/${rom.id}/content`
  const { core, shader } = preference.emulator.platform[rom.platform]
  const {
    data: emulator,
    isLoading: isPreparing,
    mutate: prepare,
  } = useSWRImmutable(romUrl, (romUrl: string) => {
    return Nostalgist.prepare({
      cache: true,
      core,
      retroarchCoreConfig: preference.emulator.core[core],
      rom: romUrl,
      shader,
      style: {
        // height: '100px',
        // width: '100px',
      },
    })
  })

  function exit() {
    emulator?.exit()
    prepare()
  }

  return { core, emulator, exit, isPreparing, prepare, rom }
}
