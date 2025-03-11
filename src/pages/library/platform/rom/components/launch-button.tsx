'use client'
import { useKeyboardEvent } from '@react-hookz/web'
import { clsx } from 'clsx'
import { useEmulator } from '../hooks/use-emulator.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function LaunchButton() {
  const { emulator, isPreparing, launch } = useEmulator()

  useKeyboardEvent(true, (event) => {
    if (emulator?.getStatus() === 'initial') {
      const isEscapeKey = event.key === 'Escape'
      const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
      const isDirectionKey = directionKeys.has(event.key)
      const shoudLaunch = !isSpecialKey && !isDirectionKey && !isEscapeKey
      if (shoudLaunch) {
        launch()
      }
    }
  })

  return (
    <button
      className={clsx(
        'inline-flex h-16 w-72 items-center justify-center gap-3 rounded bg-[var(--theme)] text-xl font-bold text-white',
        { 'opacity-50': isPreparing },
      )}
      disabled={isPreparing}
      onClick={launch}
      type='button'
    >
      <span
        className={
          isPreparing
            ? 'icon-[mdi--loading] animate-spin'
            : 'icon-[mdi--play] motion-preset-pulse-lg motion-duration-1000'
        }
      />
      {isPreparing ? 'Loading...' : 'Press any key to start'}
    </button>
  )
}
