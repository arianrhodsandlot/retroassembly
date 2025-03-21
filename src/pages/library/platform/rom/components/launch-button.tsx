'use client'
import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useEmulator } from '../hooks/use-emulator.ts'

export function LaunchButton() {
  const { isPreparing, launch } = useEmulator()

  return (
    <button className={clsx({ 'opacity-50': isPreparing })} disabled={isPreparing} onClick={launch} type='button'>
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
    </button>
  )
}
