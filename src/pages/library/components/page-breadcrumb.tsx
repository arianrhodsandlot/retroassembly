import { Button } from '@radix-ui/themes'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useLocation } from 'react-router'
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
  const location = useLocation()

  const links = [
    {
      icon: <span className='icon-[mdi--home] size-5 p-0.5' />,
      text: '',
      url: generatePath(isDemo ? routes.demoHome : routes.libraryHome),
    },
  ]

  if (!isDemo) {
    switch (location.pathname) {
      case routes.libraryRoms:
        links.push({
          icon: <span className='icon-[mdi--bookshelf] size-5 p-0.5' />,
          text: t('common.games'),
          url: generatePath(routes.libraryRoms),
        })
        break
      case routes.libraryFavorites:
        links.push({
          icon: <span className='icon-[mdi--heart] size-5 p-0.5' />,
          text: t('nav.favorites'),
          url: generatePath(routes.libraryFavorites),
        })
        break
      case routes.libraryHistory:
        links.push({
          icon: <span className='icon-[mdi--history] size-5 p-0.5' />,
          text: t('nav.history'),
          url: generatePath(routes.libraryHistory),
        })
        break
      default:
    }
  }

  if (platform) {
    links.push({
      icon: (
        <img
          alt={t(platform.displayNameI18nKey)}
          className='size-6'
          loading='lazy'
          src={getPlatformIcon(platform.name)}
        />
      ),
      text: t(platform.displayNameI18nKey),
      url: generatePath(isDemo ? routes.demoPlatform : routes.libraryPlatform, { platform: platform.name }),
    })

    if (rom) {
      links.push({
        icon: (
          <img
            alt={t(platform.displayNameI18nKey)}
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
          <Button asChild className='bg-transparent! text-(--gray-11)!' key={url} variant='ghost'>
            <div>
              {icon}
              {text}
            </div>
          </Button>
        ) : (
          <Fragment key={url}>
            <Button asChild className='group bg-transparent! font-semibold! text-(--accent-9)!' variant='ghost'>
              <NavigatableLink to={url}>
                {({ isPending }) => (
                  <>
                    <span className='relative size-6'>
                      {isPending ? (
                        <span className='absolute inset-0 z-1 hidden items-center justify-center bg-(--color-background) group-focus:flex'>
                          <span className='icon-[svg-spinners--180-ring]' />
                        </span>
                      ) : null}
                      {icon}
                    </span>
                    {text}
                  </>
                )}
              </NavigatableLink>
            </Button>
            <span className='icon-[mdi--menu-right] text-(--gray-11)' />
          </Fragment>
        ),
      )}
    </div>
  )
}
