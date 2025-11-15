import { Button, HoverCard } from '@radix-ui/themes'
import { clsx } from 'clsx'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { useLaunchButton } from '@/pages/library/atoms.ts'
import { useEmulator } from '@/pages/library/components/emulator-portal/hooks/use-emulator.ts'
import { useFocusIndicator } from '@/pages/library/hooks/use-focus-indicator.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getFileUrl } from '@/pages/library/utils/file.ts'
import { LaunchButton } from '../../platform/rom/components/launch-button.tsx'
import { EmulatorPortal } from '../emulator-portal/emulator-portal.tsx'
import { BioseMissingMessage } from './biose-missing-message.tsx'

const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isChromeLike = /chrome/i.test(navigator.userAgent)
const isMacLike = /macintosh/i.test(navigator.userAgent)
const isAppleMobileDesktopMode =
  !isChromeLike && isMacLike && /safari/i.test(navigator.userAgent) && screen.height <= 1366
const mayNeedsUserInteraction = isAppleMobile || isAppleMobileDesktopMode

export function GameButtons() {
  const { rom, state } = useLoaderData()
  const { t } = useTranslation()
  const { error, isPreparing, launch, prepare } = useEmulator()
  const [, setLaunchButtonRect] = useLaunchButton()
  const { syncStyle } = useFocusIndicator()
  const { preference } = usePreference()

  const { bioses } = preference.emulator.platform[rom.platform]

  const expectedBioses = platformMap[rom.platform].bioses
  const missingBioses = expectedBioses?.filter(
    (bios) => bios.required && !bioses?.some((b) => b.fileName === bios.name),
  )

  function handleClickCommon(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget
    if (button) {
      setLaunchButtonRect(button)
      button.blur()
      syncStyle()
    }
  }

  async function handleClickContinue(event: MouseEvent<HTMLButtonElement>) {
    if (isPreparing || (mayNeedsUserInteraction && !event?.clientX && !event?.clientY)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    handleClickCommon(event)
    await launch({ withState: true })
  }

  async function handleClickStart(event: MouseEvent<HTMLButtonElement>) {
    if (isPreparing || (mayNeedsUserInteraction && !event?.clientX && !event?.clientY)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    handleClickCommon(event)
    await launch()
  }

  async function handleClickRetry() {
    if (!isPreparing) {
      await prepare()
    }
  }

  if (missingBioses?.length) {
    return <BioseMissingMessage bioses={missingBioses} />
  }

  if (!isPreparing && error) {
    return (
      <div className='bg-(--accent-4) flex h-16 w-full items-center justify-center gap-2 rounded lg:w-80'>
        <span className='icon-[mdi--warning-decagram]' />
        <span className='text-sm opacity-60'>{t('Failed to load the emulator.')}</span>
        <Button onClick={handleClickRetry} size='1' type='button'>
          <span className='icon-[mdi--reload]' />
          {t('Retry')}
        </Button>
      </div>
    )
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
                'size-6',
                mayNeedsUserInteraction ? 'icon-[mdi--gesture-touch]' : 'icon-[mdi--arrow-u-right-top-bold]',
              )}
            />
          )}
          <span className='w-52 text-2xl font-semibold'>{t('Continue')}</span>
          <HoverCard.Root>
            <HoverCard.Trigger>
              <img
                alt={t('state')}
                className='size-10 rounded-sm border-2 border-white bg-neutral-200 object-cover shadow'
                src={getFileUrl(state.thumbnailFileId)}
              />
            </HoverCard.Trigger>
            <HoverCard.Content align='center' hideWhenDetached side='top' size='1'>
              <img
                alt={t('state')}
                className='size-48 cursor-pointer rounded-sm border-2 border-white bg-neutral-200 object-cover shadow'
                src={getFileUrl(state.thumbnailFileId)}
              />
            </HoverCard.Content>
          </HoverCard.Root>
        </LaunchButton>
      ) : null}

      <LaunchButton disabled={isPreparing} onClick={handleClickStart} variant={state ? 'outline' : 'solid'}>
        {isPreparing ? (
          <span className='icon-[svg-spinners--180-ring]' />
        ) : (
          <span
            className={clsx('size-6', mayNeedsUserInteraction ? 'icon-[mdi--gesture-touch]' : 'icon-[mdi--play]')}
          />
        )}
        <span className='w-52 text-2xl font-semibold'>{t('Start')}</span>
      </LaunchButton>

      <EmulatorPortal />
    </div>
  )
}
