import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import type { Nostalgist } from 'nostalgist'
import type { CoreName } from '@/constants/core.ts'
import { emulatorAtom, emulatorResouceAtom, emulatorStatusAtom } from '../atoms.ts'

export function useEmulator() {
  const [emulator, setEmulator] = useAtom(emulatorAtom)
  const resetEmulator = useResetAtom(emulatorAtom)
  const [status, setEmulatorStatus] = useAtom(emulatorStatusAtom)
  const resetEmulatorStatus = useResetAtom(emulatorStatusAtom)
  const [emulatorResouce, setEmulatorResouce] = useAtom(emulatorResouceAtom)
  const { core, rom } = emulatorResouce

  function exit() {
    getEmulator().getEmulator().resume()
    resetEmulator()
    resetEmulatorStatus()
  }

  function initEmulator({ core, emulator, rom }: { core: CoreName; emulator: Nostalgist; rom: any }) {
    setEmulator(emulator)
    setEmulatorResouce({ core, rom })
    resetEmulatorStatus()
  }

  function launch() {
    getEmulator().getEmulator().launch()
    setEmulatorStatus('running')
  }

  function pause() {
    getEmulator().getEmulator().pause()
    setEmulatorStatus('paused')
  }

  function restart() {
    getEmulator().getEmulator().restart()
    setEmulatorStatus('running')
  }

  function resume() {
    getEmulator().getEmulator().resume()
    setEmulatorStatus('running')
  }

  function togglePause() {
    if (status === 'running') {
      pause()
    } else if (status === 'paused') {
      resume()
    }
  }

  function getEmulator() {
    if (!emulator) {
      throw new Error('emulator is not available')
    }
    return emulator
  }

  return {
    core,
    exit,
    getEmulator,
    initEmulator,
    launch,
    pause,
    restart,
    resume,
    rom,
    setEmulator,
    status,
    togglePause,
  }
}
