'use client'
import { Button } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { settingsDialogOpenAtom } from '@/pages/library/atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function LaunchButton() {
  const [settingsDialogOpen] = useAtom(settingsDialogOpenAtom)
  const { emulator, isPreparing, launch } = useEmulator()

  const shouldListenKeyboard = settingsDialogOpen === false && emulator?.getStatus() === 'initial'
  useKeyboardEvent(true, async (event) => {
    if (!shouldListenKeyboard) {
      return
    }
    const isEscapeKey = event.key === 'Escape'
    const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
    const isDirectionKey = directionKeys.has(event.key)
    const shoudLaunch = !isSpecialKey && !isDirectionKey && !isEscapeKey
    if (shoudLaunch) {
      await launch()
    }
  })

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
