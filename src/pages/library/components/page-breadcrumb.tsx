import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { Fragment } from 'react'
import { getPlatformGameIcon, getPlatformIcon, getRomGoodcodes } from '@/utils/library.ts'
import { useIsDemo } from '../hooks/use-demo.ts'
import { usePlatform } from '../hooks/use-platform.ts'
import { useRom } from '../hooks/use-rom.ts'
import { NavigatableLink } from './navigatable-link.tsx'

export function PageBreadcrumb() {
  const rom = useRom()
  const platform = usePlatform()
  const isDemo = useIsDemo()
  const libraryPath = isDemo ? 'demo' : 'library'

  const links = [
    {
      icon: <span className='icon-[mdi--bookshelf] size-5 p-0.5' />,
      text: 'Library',
      url: `/${libraryPath}`,
    },
  ]

  if (platform) {
    links.push({
      icon: (
        <img
          alt={platform.displayName}
          className={clsx('size-6', { invert: ['ngp', 'wonderswan'].includes(platform.name) })}
          src={getPlatformIcon(platform.name)}
        />
      ),
      text: platform.displayName,
      url: `/${libraryPath}/platform/${platform.name}`,
    })

    if (rom) {
      links.push({
        icon: <img alt={platform.displayName} className='size-5 p-0.5' src={getPlatformGameIcon(rom.platform)} />,
        text: getRomGoodcodes(rom).rom,
        url: `/${libraryPath}/rom/${rom.id}`,
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
          <Button asChild className='!text-(--gray-11) !bg-transparent' key={url} variant='ghost'>
            <div>
              {icon}
              {text}
            </div>
          </Button>
        ) : (
          <Fragment key={url}>
            <Button asChild className='!text-(--accent-9) !bg-transparent !font-semibold' variant='ghost'>
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
