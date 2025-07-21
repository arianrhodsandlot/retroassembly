import { clsx } from 'clsx'
import type { MouseEvent } from 'react'
import type { State } from '@/controllers/get-states.ts'
import { useFocusIndicator } from '@/pages/library/hooks/use-focus-indicator.ts'
import { useLaunchButtonRect } from '../atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { LaunchButton } from './launch-button.tsx'

const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isChromeLike = /chrome/i.test(navigator.userAgent)
const isMacLike = /macintosh/i.test(navigator.userAgent)
const isAppleMobileDesktopMode =
  !isChromeLike && isMacLike && /safari/i.test(navigator.userAgent) && screen.height <= 1366
const mayNeedsUserInteraction = isAppleMobile || isAppleMobileDesktopMode

export function LaunchButtons({ state }: { state?: State }) {
  const { isPreparing, launch } = useEmulator()
  const [, setLaunchButtonRect] = useLaunchButtonRect()
  const { syncStyle } = useFocusIndicator()

  function handleClickCommon(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget
    if (button) {
      const rect = button.getBoundingClientRect()
      setLaunchButtonRect(rect)
      button.blur()
      syncStyle()
    }
  }

  async function handleClickContinue(event: MouseEvent<HTMLButtonElement>) {
    if (mayNeedsUserInteraction && !event?.clientX && !event?.clientY) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    handleClickCommon(event)
    await launch({ withState: true })
  }

  async function handleClickStart(event: MouseEvent<HTMLButtonElement>) {
    if (mayNeedsUserInteraction && !event?.clientX && !event?.clientY) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    handleClickCommon(event)
    await launch()
  }

  return (
    <div className='flex w-full flex-col items-center gap-4 lg:flex-row'>
      {state ? (
        <LaunchButton disabled={isPreparing} onClick={handleClickContinue}>
          {isPreparing ? (
            <span className='icon-[svg-spinners--180-ring]' />
          ) : (
            <span
              className={clsx(
                'motion-preset-pulse-lg motion-duration-1500',
                mayNeedsUserInteraction ? 'icon-[mdi--gesture-touch]' : 'icon-[mdi--motion-play-outline]',
              )}
            />
          )}
          <span className='w-52 text-2xl font-semibold'>Continue</span>
          <img
            alt='state'
            className='size-8 rounded-sm bg-transparent object-cover shadow'
            src={`/api/v1/files/${encodeURIComponent(state.thumbnailFileId)}`}
          />
        </LaunchButton>
      ) : null}
      <LaunchButton disabled={isPreparing} onClick={handleClickStart} variant={state ? 'outline' : 'solid'}>
        {isPreparing ? (
          <span className='icon-[svg-spinners--180-ring]' />
        ) : (
          <span
            className={clsx(
              { 'motion-preset-pulse-lg motion-duration-1500': !state },
              mayNeedsUserInteraction ? 'icon-[mdi--gesture-touch]' : 'icon-[mdi--play]',
            )}
          />
        )}
        <span className='w-52 text-2xl font-semibold'>Start</span>
      </LaunchButton>
    </div>
  )
}
