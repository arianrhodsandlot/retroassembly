import ky from 'ky'
import { Nostalgist } from 'nostalgist'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { coreUrlMap } from '@/constants/core.ts'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { usePreference } from '../../../hooks/use-preference.ts'

type NostalgistOption = Parameters<typeof Nostalgist.prepare>[0]

const defaultRetroarchConfig = {
  input_enable_hotkey_btn: 8, // select
  input_hold_fast_forward_btn: 7, // R2
  input_player1_analog_dpad_mode: 1,
  input_player2_analog_dpad_mode: 1,
  input_player3_analog_dpad_mode: 1,
  input_player4_analog_dpad_mode: 1,
  input_rewind_btn: 6, // L2
  rewind_enable: true,
  rewind_granularity: 2,
}

const defaultEmulatorStyle: Partial<CSSStyleDeclaration> = {
  backgroundPosition: ['left center', 'right center'].join(','),
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  cursor: 'none',
  opacity: '0',
  transition: 'opacity .1s',
}

export function useEmulator() {
  const rom = useRom()
  if (!rom) {
    throw new Error('this should not happen')
  }
  const { data: cover } = useRomCover(rom)
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [launched, setLaunched] = useEmulatorLaunched()
  const isDemo = useIsDemo()

  const romUrl = isDemo
    ? getCDNUrl(`retrobrews/${{ genesis: 'md' }[rom.platform] || rom.platform}-games`, rom.fileName)
    : `/api/v1/roms/${rom.id}/content`
  const { core } = preference.emulator.platform[rom.platform] || {}
  const shader = preference.emulator.platform[rom.platform].shader || preference.emulator.shader

  const backgroundImage =
    cover?.type === 'rom' ? Array.from({ length: 2 }).fill(`url('${cover.src}')`).join(',') : 'none'

  const romObject = useMemo(() => ({ fileContent: romUrl, fileName: rom?.fileName }), [rom, romUrl])
  const options: NostalgistOption = useMemo(
    () => ({
      cache: true,
      core: coreUrlMap[core] || core,
      retroarchConfig: { ...defaultRetroarchConfig, ...preference.input.keyboardMapping, ...gamepadMapping },
      retroarchCoreConfig: preference.emulator.core[core],
      rom: romObject,
      shader,
      style: { ...defaultEmulatorStyle, backgroundImage },
    }),
    [romObject, core, preference, gamepadMapping, backgroundImage, shader],
  )

  const shouldPrepare = Boolean(rom && cover)

  const {
    data: emulator,
    error,
    isValidating,
    mutate: prepare,
  } = useSWRImmutable(shouldPrepare ? options : false, () => Nostalgist.prepare(options))

  const isPreparing = !shouldPrepare || isValidating

  async function launch() {
    if (!emulator || !rom) {
      return
    }

    const canvas = emulator.getCanvas()
    canvas.setAttribute('tabindex', '-1')
    canvas.dataset.snFocusStyle = JSON.stringify({ display: 'none' })
    focus(canvas)

    setLaunched(true)

    if (!isDemo) {
      const formData = new FormData()
      formData.append('core', core)
      formData.append('rom', rom.id)
      await ky.post('/api/v1/launch_records', {
        body: formData,
      })
    }
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
