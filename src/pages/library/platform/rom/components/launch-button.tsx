import { Button, Portal } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { type MouseEvent, useEffect, useRef } from 'react'
import { useFocusIndicator } from '@/pages/library/hooks/use-focus-indicator.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { useLaunchButtonRect } from '../atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { GameAnimatePresence } from './game-animate-presence.tsx'

const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isChromeLike = /chrome/i.test(navigator.userAgent)
const isMacLike = /macintosh/i.test(navigator.userAgent)
const isAppleMobileDesktopMode =
  !isChromeLike && isMacLike && /safari/i.test(navigator.userAgent) && screen.height <= 1366
const mayNeedsUserInteraction = isAppleMobile || isAppleMobileDesktopMode

export function LaunchButton() {
  const { isPreparing, launch } = useEmulator()
  const ref = useRef<HTMLButtonElement>(null)
  const [, setLaunchButtonRect] = useLaunchButtonRect()
  const { syncStyle } = useFocusIndicator()

  const isWaitingForTouch = mayNeedsUserInteraction && !isPreparing
  const isWaitingForPressOrClick = !mayNeedsUserInteraction && !isPreparing

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isWaitingForTouch && !event?.clientX && !event?.clientY) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    const button = event.currentTarget
    if (button) {
      const rect = button.getBoundingClientRect()
      setLaunchButtonRect(rect)
      button.blur()
      syncStyle()
    }

    await launch()
  }

  useEffect(() => {
    if (!isPreparing && ref.current) {
      ref.current.dataset.snFocusStyle = JSON.stringify({ transitionProperty: 'none' })
      focus(ref.current)
      delete ref.current.dataset.snFocusStyle
    }
  }, [isPreparing])

  return (
    <button
      className={clsx('launch-button block w-full lg:w-auto', { 'opacity-50': isPreparing })}
      data-sn-enabled
      disabled={isPreparing}
      onClick={handleClick}
      ref={ref}
      type='button'
    >
      <Button asChild radius='small' size='4' type='button'>
        <div className='!h-16 !w-full'>
          {isPreparing ? (
            <>
              <span className='icon-[mdi--loading] animate-spin' />
              <span className='w-52 text-2xl font-semibold'>Loading...</span>
            </>
          ) : null}
          {isWaitingForTouch ? (
            <>
              <span className='icon-[mdi--gesture-touch] motion-preset-pulse-lg motion-duration-1500' />
              <span className='w-52 text-2xl font-semibold'>Start</span>
            </>
          ) : null}
          {isWaitingForPressOrClick ? (
            <>
              <span className='icon-[mdi--play] motion-preset-pulse-lg motion-duration-1500' />
              <span className=' w-52 text-2xl font-semibold'>Start</span>
            </>
          ) : null}
        </div>
      </Button>

      <Portal>
        <GameAnimatePresence />
      </Portal>
    </button>
  )
}
