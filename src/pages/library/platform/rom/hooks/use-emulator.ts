import { useAtom } from 'jotai'
import ky from 'ky'
import { Nostalgist } from 'nostalgist'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { coreUrlMap } from '@/constants/core.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { usePreference } from '../../../hooks/use-preference.ts'
import { emulatorLaunchedAtom } from '../atoms.ts'

export function useEmulator() {
  const rom = useRom()
  const { data: cover } = useRomCover(rom)
  const { preference } = usePreference()
  const [launched, setLaunched] = useAtom(emulatorLaunchedAtom)

  const romUrl = rom ? `/api/v1/rom/${rom.id}/content` : ''
  const { core } = preference.emulator.platform[rom.platform] || {}
  const shader = preference.emulator.platform[rom.platform].shader || preference.emulator.shader
  const options: Parameters<typeof Nostalgist.prepare>[0] = useMemo(
    () => ({
      cache: true,
      core: coreUrlMap[core] || core,
      retroarchConfig: {
        rewind_enable: true,
        rewind_granularity: 2,
        ...preference.emulator.keyboardMapping,
      },
      retroarchCoreConfig: preference.emulator.core[core],
      rom: { fileContent: romUrl, fileName: rom?.fileName },
      shader,
      style: {
        backgroundImage:
          cover?.type === 'rom' ? Array.from({ length: 2 }).fill(`url('${cover.src}')`).join(',') : 'none',
        backgroundPosition: ['left center', 'right center'].join(','),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: '0',
        transition: 'opacity .1s',
      },
    }),
    [rom, core, preference.emulator.core, preference.emulator.keyboardMapping, romUrl, shader, cover],
  )

  const shouldPrepare = Boolean(rom && cover)

  const {
    data: emulator,
    error,
    isLoading,
    mutate: prepare,
  } = useSWRImmutable(shouldPrepare ? options : false, () => Nostalgist.prepare(options))

  const isPreparing = !shouldPrepare || isLoading

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

  if (error) {
    console.error(error)
  }

  return { core, emulator, exit, isPreparing, launch, launched, prepare, setLaunched }
}
