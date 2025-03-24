'use client'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { useRouter_UNSTABLE } from 'waku'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { platformAtom } from '../../atoms.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { SidebarLink } from './sidebar-link.tsx'

function getPlatformLink(platform?: string) {
  if (!platform) {
    return ''
  }
  return `/library/platform/${encodeURIComponent(platform)}`
}

export function SidebarLinks() {
  const router = useRouter_UNSTABLE()
  const { preference } = usePreference()
  const [currentPlatform] = useAtom(platformAtom)

  function isLinkActive(link: string) {
    return router.path === link || getPlatformLink(currentPlatform?.name) === link
  }

  const platformLinks = preference.ui.platforms.map((platform) => ({
    icon: getPlatformIcon(platform),
    platform,
    text: platformMap[platform].displayName,
    to: getPlatformLink(platform),
  }))

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        {[
          { icon: <span className='icon-[mdi--bookshelf] size-5 p-0.5' />, text: 'Library', to: '/library' },
          { icon: <span className='icon-[mdi--history] size-5 p-0.5' />, text: 'History', to: '/library/history' },
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
