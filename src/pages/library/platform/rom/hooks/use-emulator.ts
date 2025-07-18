import ky from 'ky'
import { Nostalgist } from 'nostalgist'
import { useEffect, useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { coreUrlMap } from '@/constants/core.ts'
import type { Rom } from '@/controllers/get-roms.ts'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { usePreference } from '../../../hooks/use-preference.ts'
import { useIsFullscreen } from '../atoms.ts'

type NostalgistOption = Parameters<typeof Nostalgist.prepare>[0]
type RetroarchConfig = Partial<NostalgistOption['retroarchConfig']>

const defaultRetroarchConfig: RetroarchConfig = {
  fastforward_ratio: 10,
  input_enable_hotkey_btn: 8, // select
  input_hold_fast_forward_btn: 7, // R2
  input_player1_analog_dpad_mode: 1,
  input_player2_analog_dpad_mode: 1,
  input_player3_analog_dpad_mode: 1,
  input_player4_analog_dpad_mode: 1,
  input_rewind_btn: 6, // L2
  rewind_enable: true,
  rewind_granularity: 4,
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
  const rom: Rom = useRom()
  if (!rom) {
    throw new Error('this should not happen')
  }
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [launched, setLaunched] = useEmulatorLaunched()
  const isDemo = useIsDemo()
  const [isFullscreen, setIsFullscreen] = useIsFullscreen()

  const romUrl = isDemo
    ? getCDNUrl(`retrobrews/${{ genesis: 'md' }[rom.platform] || rom.platform}-games`, rom.fileName)
    : `/api/v1/files/${encodeURIComponent(rom.fileId)}`
  const { core } = preference.emulator.platform[rom.platform] || {}
  const shader = preference.emulator.platform[rom.platform].shader || preference.emulator.shader

  const romObject = useMemo(() => ({ fileContent: romUrl, fileName: rom?.fileName }), [rom, romUrl])
  const options: NostalgistOption = useMemo(
    () => ({
      cache: true,
      core: coreUrlMap[core] || core,
      retroarchConfig: {
        ...defaultRetroarchConfig,
        ...preference.input.keyboardMapping,
        ...gamepadMapping,
        video_smooth: preference.emulator.videoSmooth,
      },
      retroarchCoreConfig: preference.emulator.core[core],
      rom: romObject,
      shader,
      style: { ...defaultEmulatorStyle },
    }),
    [romObject, core, preference, gamepadMapping, shader],
  )

  const {
    data: emulator,
    error,
    isValidating,
    mutate: prepare,
  } = useSWRImmutable(rom ? options : false, () => Nostalgist.prepare(options))

  const isPreparing = !rom || isValidating

  async function launch() {
    if (!emulator || !rom) {
      return
    }
    globalThis.emulator = emulator

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
    const status = emulator?.getStatus() || ''
    if (['paused', 'running'].includes(status)) {
      emulator?.exit()
      setLaunched(false)
      focus('.launch-button')
      try {
        await document.exitFullscreen()
      } catch {}
      setIsFullscreen(false)
      await prepare()
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        await document.body.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch {}
  }

  useEffect(() => {
    const abortController = new AbortController()
    document.body.addEventListener(
      'fullscreenchange',
      () => {
        setIsFullscreen(document.fullscreenElement === document.body)
      },
      { signal: abortController.signal },
    )
    return () => {
      abortController.abort()
    }
  })

  if (error) {
    console.error(error)
  }

  return { core, emulator, exit, isFullscreen, isPreparing, launch, launched, prepare, setLaunched, toggleFullscreen }
}
