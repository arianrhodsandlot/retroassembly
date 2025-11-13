import { HoverCard } from '@radix-ui/themes'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import type { loader } from '@/pages/routes/library-home.tsx'
import { getPlatformIcon, getRomGoodcodes } from '@/utils/client/library.ts'
import { GameEntryImage } from '../../components/game-entry/game-entry-image.tsx'
import { LaunchButton } from '../../platform/rom/components/launch-button.tsx'
import { RomBackground } from '../../platform/rom/components/rom-background.tsx'
import { getFileUrl } from '../../utils/file.ts'

export function JumpBackInSection() {
  const {
    recentlySavedRoms: [rom],
  } = useLoaderData<typeof loader>()
  const { t } = useTranslation()

  if (!rom) {
    return
  }

  return (
    <section className='translate-z-0 relative'>
      <div className='bg-linear-to-b from-(--gray-a6) flex flex-col gap-4 rounded via-transparent to-transparent p-8 transition-colors duration-500 lg:flex-row'>
        <div className='flex w-96 max-w-full items-center justify-center'>
          <GameEntryImage rom={rom} />
        </div>
        <div className='flex flex-col justify-center gap-4'>
          <h3 className='text-4xl font-semibold'>{getRomGoodcodes(rom).rom}</h3>

          <div className='text-(--color-text)/40 flex items-center gap-1'>
            <img
              alt={t(platformMap[rom.platform].displayName)}
              className={clsx('size-6', { invert: ['ngp', 'wonderswan'].includes(platformMap[rom.platform].name) })}
              loading='lazy'
              src={getPlatformIcon(platformMap[rom.platform].name)}
            />
            {platformMap[rom.platform].displayName}
          </div>

          <LaunchButton>
            <span className='icon-[mdi--motion-play-outline] motion-preset-pulse-lg motion-duration-1500' />
            <span className='w-52 text-2xl font-semibold'>{t('Continue')}</span>
            {rom.stateThumbnailFileId ? (
              <HoverCard.Root>
                <HoverCard.Trigger>
                  <img
                    alt={t('state')}
                    className='size-10 rounded-sm border-2 border-white bg-neutral-200 object-cover shadow'
                    src={getFileUrl(rom.stateThumbnailFileId)}
                  />
                </HoverCard.Trigger>
                <HoverCard.Content align='center' hideWhenDetached side='top' size='1'>
                  <img
                    alt={t('state')}
                    className='size-48 cursor-pointer rounded-sm border-2 border-white bg-neutral-200 object-cover shadow'
                    src={getFileUrl(rom.stateThumbnailFileId)}
                  />
                </HoverCard.Content>
              </HoverCard.Root>
            ) : null}
          </LaunchButton>
        </div>
      </div>
      <RomBackground rom={rom} />
    </section>
  )
}
