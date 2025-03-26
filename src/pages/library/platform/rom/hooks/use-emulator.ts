import ky from 'ky'
import { Nostalgist } from 'nostalgist'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { coreUrlMap } from '@/constants/core.ts'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { usePreference } from '../../../hooks/use-preference.ts'

type NostalgistOption = Parameters<typeof Nostalgist.prepare>[0]

export function useEmulator() {
  const rom = useRom()
  const { data: cover } = useRomCover(rom)
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [launched, setLaunched] = useEmulatorLaunched()

  const romUrl = rom ? `/api/v1/rom/${rom.id}/content` : ''
  const { core } = preference.emulator.platform[rom.platform] || {}
  const shader = preference.emulator.platform[rom.platform].shader || preference.emulator.shader

  const retroarchConfig: NostalgistOption['retroarchConfig'] = useMemo(
    () => ({
      input_enable_hotkey_btn: 8, // select
      input_hold_fast_forward_btn: 7, // R2
      input_player1_analog_dpad_mode: 1,
      input_player2_analog_dpad_mode: 1,
      input_player3_analog_dpad_mode: 1,
      input_player4_analog_dpad_mode: 1,
      input_rewind_btn: 6, // L2
      rewind_enable: true,
      rewind_granularity: 2,
      ...preference.emulator.keyboardMapping,
      ...gamepadMapping,
    }),
    [preference.emulator.keyboardMapping, gamepadMapping],
  )

  const style: NostalgistOption['style'] = useMemo(
    () => ({
      backgroundImage: cover?.type === 'rom' ? Array.from({ length: 2 }).fill(`url('${cover.src}')`).join(',') : 'none',
      backgroundPosition: ['left center', 'right center'].join(','),
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      opacity: '0',
      transition: 'opacity .1s',
    }),
    [cover],
  )

  const options: NostalgistOption = useMemo(
    () => ({
      cache: true,
      core: coreUrlMap[core] || core,
      retroarchConfig,
      retroarchCoreConfig: preference.emulator.core[core],
      rom: { fileContent: romUrl, fileName: rom?.fileName },
      shader,
      style,
    }),
    [rom, core, retroarchConfig, preference.emulator.core, romUrl, shader, style],
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
    if (!emulator) {
      return
    }

    await emulator.start()

    const canvas = emulator.getCanvas()
    canvas.setAttribute('tabindex', '-1')
    canvas.dataset.focusDisplay = 'none'
    focus(canvas)

    setLaunched(true)

    const formData = new FormData()
    formData.append('core', core)
    formData.append('rom', rom.id)
    await ky.post('/api/v1/launch_record/new', {
      body: formData,
    })
  }

  async function exit() {
    emulator?.exit()
    setLaunched(false)
    focus('.launch-button')
    await prepare()
  }

  if (error) {
    console.error(error)
  }

  return { core, emulator, exit, isPreparing, launch, launched, prepare, setLaunched }
}
