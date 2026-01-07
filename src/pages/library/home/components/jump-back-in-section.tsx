import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { generatePath, Link, useLoaderData } from 'react-router'
import { platformMap } from '#@/constants/platform.ts'
import { routes } from '#@/pages/routes.ts'
import type { loader } from '#@/pages/routes/library-home.tsx'
import { getPlatformIcon, getRomGoodcodes } from '#@/utils/client/library.ts'
import { GameButtons } from '../../components/game-buttons/game-buttons.tsx'
import { GameEntryImage } from '../../components/game-entry/game-entry-image.tsx'
import { RomBackground } from '../../components/rom-background.tsx'

export function JumpBackInSection() {
  const { rom } = useLoaderData<typeof loader>()
  const { t } = useTranslation()

  if (!rom) {
    return
  }

  return (
    <section className='relative'>
      <RomBackground className='lg:absolute' rom={rom} />

      <div className='bg-linear-to-b from-(--gray-a4) relative rounded via-transparent to-transparent p-4'>
        <h2 className='text-(--accent-9) flex items-center gap-2 p-4 text-3xl font-semibold'>
          <span className='icon-[mdi--play-circle-outline]' />
          {t('Continue')}
        </h2>

        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='mx-auto flex w-96 max-w-full items-center justify-center lg:mx-0'>
            <GameEntryImage centered rom={rom} />
          </div>
          <div className='flex flex-col justify-center gap-4'>
            <Link to={generatePath(routes.libraryPlatformRom, { fileName: rom.fileName, platform: rom.platform })}>
              <h3 className='text-4xl font-semibold'>{getRomGoodcodes(rom).rom}</h3>
            </Link>

            <div className='text-(--color-text)/40 flex items-center gap-1'>
              <img
                alt={t(platformMap[rom.platform].displayName)}
                className={clsx('size-6', { invert: ['ngp', 'wonderswan'].includes(platformMap[rom.platform].name) })}
                loading='lazy'
                src={getPlatformIcon(platformMap[rom.platform].name)}
              />
              {t(platformMap[rom.platform].displayName)}
            </div>

            <GameButtons />
          </div>
        </div>
      </div>
    </section>
  )
}
