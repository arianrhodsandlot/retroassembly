import { useAtom } from 'jotai'
import ky from 'ky'
import { Nostalgist } from 'nostalgist'
import useSWRImmutable from 'swr/immutable'
import { usePreference } from '../../../hooks/use-preference.ts'
import { emulatorLaunchedAtom } from '../atoms.ts'
import { useRom } from './use-rom.ts'

export function useEmulator() {
  const rom = useRom()
  const preference = usePreference()
  const [launched, setLaunched] = useAtom(emulatorLaunchedAtom)

  globalThis.setLaunched = setLaunched

  const romUrl = rom ? `/api/v1/rom/${rom.id}/content` : ''
  const { core, shader } = preference.emulator.platform[rom?.platform] || {}
  const {
    data: emulator,
    isLoading: isPreparing,
    mutate: prepare,
  } = useSWRImmutable(romUrl || false, (romUrl: string) => {
    return Nostalgist.prepare({
      cache: true,
      core,
      retroarchCoreConfig: preference.emulator.core[core],
      rom: romUrl,
      shader,
      style: {
        opacity: '0',
        transition: 'opacity .1s',
      },
    })
  })

  async function launch() {
    await emulator?.start()
    setLaunched(true)
    const formData = new FormData()
    formData.append('core', core)
    formData.append('rom', rom.id)
    await ky.post('/api/v1/launch_record/new', {
      body: formData,
    })
  }

  function exit() {
    emulator?.exit()
    setLaunched(false)
    prepare()
  }

  return { core, emulator, exit, isPreparing, launch, launched, prepare, rom, setLaunched }
}
