'use client'
import { useKeyboardEvent } from '@react-hookz/web'
import { clsx } from 'clsx'
import { Nostalgist } from 'nostalgist'
import { useEffect } from 'react'
import useSWRMutation from 'swr/mutation'
import { usePreference } from '../../hooks/use-preference.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { GameOverlay } from './game-overlay/game-overlay.tsx'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])
export function LaunchButton({ rom }) {
  const preference = usePreference()
  const romUrl = `/api/v1/rom/${rom.id}/content`
  const { isMutating, trigger } = useSWRMutation(romUrl, prepareEmulator)
  const { initEmulator, launch, status, togglePause } = useEmulator()

  const { core, shader } = preference.emulator.platform[rom.platform]
  const retroarchCoreConfig = preference.emulator.core[core]
  async function prepareEmulator(rom: string) {
    const nostalgist = await Nostalgist.prepare({
      core,
      retroarchCoreConfig,
      rom,
      shader,
      style: {
        // height: '100px',
        // width: '100px',
      },
    })
    initEmulator({ core, emulator: nostalgist, rom })
  }

  useKeyboardEvent(true, (event) => {
    if ((status === 'running' || status === 'paused') && event.key === 'Escape') {
      togglePause()
    } else if (status === 'initial') {
      const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
      const isDirectionKey = directionKeys.has(event.key)
      if (!isSpecialKey && !isDirectionKey && event.key !== 'Escape') {
        launch()
      }
    }
  })

  useEffect(() => {
    trigger()
  }, [trigger])

  return (
    <>
      <button
        className={clsx(
          'inline-flex h-16 w-72 items-center justify-center gap-1.5 rounded bg-rose-700 text-xl  font-bold text-white',
          { 'opacity-50': isMutating },
        )}
        disabled={isMutating}
        onClick={start}
        type='button'
      >
        <span className={isMutating ? 'icon-[mdi--loading] animate-spin' : 'icon-[mdi--play]'} />
        {isMutating ? 'Loading...' : 'Press any key to start'}
      </button>
      <GameOverlay core={core} rom={rom} />
    </>
  )
}
