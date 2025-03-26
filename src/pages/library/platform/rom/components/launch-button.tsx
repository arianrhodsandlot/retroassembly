'use client'
import { Button, Portal } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { GameAnimatePresence } from './game-animate-presence.tsx'

export function LaunchButton() {
  const { isPreparing, launch } = useEmulator()
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isPreparing && ref.current) {
      ref.current.dataset.focusTransitionProperty = 'none'
      focus(ref.current)
      delete ref.current.dataset.focusTransitionProperty
    }
  }, [isPreparing])

  return (
    <button
      className={clsx('launch-button', { 'opacity-50': isPreparing })}
      disabled={isPreparing}
      onClick={launch}
      ref={ref}
      type='button'
    >
      <Button asChild className='!h-16' radius='small' size='4' type='button'>
        <div>
          <span
            className={
              isPreparing
                ? 'icon-[mdi--loading] animate-spin'
                : 'icon-[mdi--play] motion-preset-pulse-lg motion-duration-1500'
            }
          />
          <span className='w-[240px] text-2xl font-semibold'>
            {isPreparing ? 'Loading...' : 'Press any key to start'}
          </span>
        </div>
      </Button>

      <Portal>
        <GameAnimatePresence />
      </Portal>
    </button>
  )
}
