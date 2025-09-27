import { attemptAsync, noop } from 'es-toolkit'
import { Nostalgist } from 'nostalgist'
import { useEffect, useMemo } from 'react'
import { useLoaderData } from 'react-router'
import useSWRImmutable from 'swr/immutable'
import { client } from '@/api/client.ts'
import { coreUrlMap } from '@/constants/core.ts'
import type { Rom } from '@/controllers/roms/get-roms.ts'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useRouter } from '@/pages/library/hooks/use-router.ts'
import { getFileUrl } from '@/pages/library/utils/file.ts'
import { focus, offCancel, onCancel } from '@/pages/library/utils/spatial-navigation.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { usePreference } from '../../../hooks/use-preference.ts'
import { useIsFullscreen, useLaunchButton } from '../atoms.ts'

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
  border: 'none',
  cursor: 'none',
  opacity: '0',
  outline: 'none',
  transition: 'opacity .1s',
}

let wakeLock: undefined | WakeLockSentinel
const originalGetUserMedia = globalThis.navigator?.mediaDevices?.getUserMedia
export function useEmulator() {
  const rom: Rom = useRom()
  if (!rom) {
    throw new Error('this should not happen')
  }
  const { state } = useLoaderData()
  const { preference } = usePreference()
  const gamepadMapping = useGamepadMapping()
  const [launched, setLaunched] = useEmulatorLaunched()
  const isDemo = useIsDemo()
  const { reloadSilently } = useRouter()
  const [isFullscreen, setIsFullscreen] = useIsFullscreen()
  const [launchButton] = useLaunchButton()

  const romUrl = isDemo
    ? getCDNUrl(`retrobrews/${{ genesis: 'md' }[rom.platform] || rom.platform}-games`, rom.fileName)
    : getFileUrl(rom.fileId) || ''
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
      state: state?.fileId ? getFileUrl(state.fileId) : undefined,
      style: { ...defaultEmulatorStyle },
    }),
    [romObject, core, preference, gamepadMapping, shader, state?.fileId],
  )

  const {
    data: emulator,
    error,
    isValidating,
    mutate: prepare,
  } = useSWRImmutable(options, () => Nostalgist.prepare(options))

  const isPreparing = !rom || isValidating

  async function launch({ withState }: { withState?: boolean } = {}) {
    if (!emulator || !rom) {
      return
    }

    if (!withState) {
      emulator.getEmulator().on('beforeLaunch', () => {
        try {
          //@ts-expect-error Using an undocumented API here. There should be a way to do this.
          emulator.getEmscriptenFS().unlink(`${emulator.getEmulator().stateFilePath}.auto`)
        } catch {}
      })
    }

    const canvas = emulator.getCanvas()
    canvas.setAttribute('tabindex', '-1')
    canvas.dataset.snFocusStyle = JSON.stringify({ display: 'none' })
    focus(canvas)

    setLaunched(true)

    if (!isDemo) {
      await client.launch_records.$post({ form: { core, rom: rom.id } })
    }
  }

  async function start() {
    if (!emulator || !rom) {
      return
    }
    try {
      // @ts-expect-error an ad-hoc patch for disabling request for camera access
      globalThis.navigator.mediaDevices.getUserMedia = null
    } catch {}
    await emulator.start()
    try {
      globalThis.navigator.mediaDevices.getUserMedia = originalGetUserMedia
    } catch {}
    const canvas = emulator.getCanvas()
    if (canvas) {
      canvas.style.opacity = '1'
    }

    if (preference.emulator.fullscreen) {
      toggleFullscreen()
    }
    try {
      wakeLock = await navigator.wakeLock.request('screen')
    } catch {}
    onCancel(noop)
  }

  async function exit() {
    const status = emulator?.getStatus() || ''
    if (['paused', 'running'].includes(status)) {
      emulator?.exit()
      setLaunched(false)
      const promises: Promise<void>[] = []
      if (document.fullscreenElement) {
        promises.push(document.exitFullscreen())
      }
      if (wakeLock) {
        promises.push(wakeLock.release())
        wakeLock = undefined
      }
      if (promises.length > 0) {
        await Promise.all(promises)
      }
      setIsFullscreen(false)
      focus(launchButton)
      offCancel()
      await attemptAsync(prepare)
      await reloadSilently()
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

  return {
    core,
    emulator,
    error,
    exit,
    isFullscreen,
    isPreparing,
    launch,
    launched,
    prepare,
    setLaunched,
    start,
    toggleFullscreen,
  }
}
