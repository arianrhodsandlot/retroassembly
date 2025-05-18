import { clsx } from 'clsx'
import { useLocation } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { usePlatform } from '../../hooks/use-platform.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { SidebarLink } from './sidebar-link.tsx'

function getPlatformLink(platform?: string, isDemo = false) {
  if (!platform) {
    return ''
  }
  const libraryPath = isDemo ? 'demo' : 'library'
  return `/${encodeURIComponent(libraryPath)}/platform/${encodeURIComponent(platform)}`
}

export function SidebarLinks() {
  const { preference } = usePreference()
  const platform = usePlatform()
  const location = useLocation()
  const isDemo = useIsDemo()
  const libraryPath = isDemo ? 'demo' : 'library'

  function isLinkActive(link: string) {
    return location.pathname === link || getPlatformLink(platform?.name, isDemo) === link
  }

  const platformLinks = preference.ui.platforms.map((platform) => ({
    icon: getPlatformIcon(platform),
    platform,
    text: platformMap[platform].displayName,
    to: getPlatformLink(platform, isDemo),
  }))

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        {[
          { icon: <span className='icon-[mdi--bookshelf] size-5 p-0.5' />, text: 'Library', to: `/${libraryPath}` },
          ...(isDemo
            ? []
            : [
                {
                  icon: <span className='icon-[mdi--history] size-5 p-0.5' />,
                  text: 'History',
                  to: '/library/history',
                },
              ]),
        ].map(({ icon, text, to }) => (
          <SidebarLink active={isLinkActive(to)} key={text} to={to}>
            {icon}
            <span className={clsx({ 'group-hover:opacity-100 opacity-90': !isLinkActive(to) })}>{text}</span>
          </SidebarLink>
        ))}
      </div>

      <div className='mt-4'>
        <h3 className='flex items-center gap-2 px-4 text-sm text-white/50'>
          <span className='icon-[mdi--gamepad-classic] size-5 p-0.5' />
          Platforms
        </h3>

        <div className='mt-2 flex flex-col gap-y-2'>
          {platformLinks.map(({ icon, platform, text, to }) => (
            <SidebarLink active={isLinkActive(to)} key={platform} to={to}>
              {icon ? (
                <div className={clsx({ '': !isLinkActive(to) })}>
                  <img
                    alt={text}
                    className={clsx('size-6', {
                      invert: isLinkActive(to) && ['ngp', 'wonderswan'].includes(platform),
                    })}
                    src={icon}
                  />
                </div>
              ) : null}
              <span className={clsx({ 'group-hover:opacity-100 opacity-90': !isLinkActive(to) })}>{text}</span>
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
