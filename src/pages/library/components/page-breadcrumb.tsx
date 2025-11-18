import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router'
import { routes } from '#@/pages/routes.ts'
import { getPlatformGameIcon, getPlatformIcon, getRomGoodcodes } from '#@/utils/client/library.ts'
import { useIsDemo } from '../hooks/use-demo.ts'
import { usePlatform } from '../hooks/use-platform.ts'
import { useRom } from '../hooks/use-rom.ts'
import { NavigatableLink } from './navigatable-link.tsx'

export function PageBreadcrumb() {
  const { t } = useTranslation()
  const rom = useRom()
  const platform = usePlatform()
  const isDemo = useIsDemo()

  const links = [
    {
      icon: <span className='icon-[mdi--bookshelf] size-5 p-0.5' />,
      text: t('Games'),
      url: generatePath(isDemo ? routes.demoHome : routes.libraryHome),
    },
  ]

  if (platform) {
    links.push({
      icon: (
        <img
          alt={t(platform.displayName)}
          className={clsx('size-6', { invert: ['ngp', 'wonderswan'].includes(platform.name) })}
          loading='lazy'
          src={getPlatformIcon(platform.name)}
        />
      ),
      text: t(platform.displayName),
      url: generatePath(isDemo ? routes.demoPlatform : routes.libraryPlatform, { platform: platform.name }),
    })

    if (rom) {
      links.push({
        icon: (
          <img
            alt={t(platform.displayName)}
            className='size-5 p-0.5'
            loading='lazy'
            src={getPlatformGameIcon(rom.platform)}
          />
        ),
        text: getRomGoodcodes(rom).rom,
        url: generatePath(isDemo ? routes.demoPlatformRom : routes.libraryPlatformRom, {
          fileName: rom.fileName,
          platform: rom.platform,
        }),
      })
    }
  }

  if (links.length === 1) {
    return
  }

  return (
    <div className='mt-4 flex max-w-full items-center gap-2 overflow-x-auto px-4 py-1 lg:px-8'>
      {links.map(({ icon, text, url }, i) =>
        i === links.length - 1 ? (
          <Button asChild className='text-(--gray-11)! bg-transparent!' key={url} variant='ghost'>
            <div>
              {icon}
              {text}
            </div>
          </Button>
        ) : (
          <Fragment key={url}>
            <Button asChild className='text-(--accent-9)! bg-transparent! font-semibold!' variant='ghost'>
              <NavigatableLink to={url}>
                {icon}
                {text}
              </NavigatableLink>
            </Button>
            <span className='icon-[mdi--menu-right] text-(--gray-11)' />
          </Fragment>
        ),
      )}
    </div>
  )
}
