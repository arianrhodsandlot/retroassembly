'use client'
import { useRouter_UNSTABLE } from 'waku'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { SidebarLink } from './sidebar-link.tsx'

function getPlatformLink(platform?: string) {
  if (!platform) {
    return ''
  }
  return `/library/platform/${encodeURIComponent(platform)}`
}

export function SidebarLinks({ currentPlatform }: { currentPlatform?: string }) {
  const router = useRouter_UNSTABLE()
  const { preference } = usePreference()

  function isLinkActive(link: string) {
    return router.path === link || getPlatformLink(currentPlatform) === link
  }

  const platformLinks = preference.ui.platforms.map((platform) => ({
    icon: getPlatformIcon(platform, ''),
    name: platform,
    text: platformMap[platform].displayName,
    to: getPlatformLink(platform),
  }))

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        {[
          { icon: <span className='icon-[mdi--bookshelf] size-5' />, text: 'Library', to: '/library' },
          { icon: <span className='icon-[mdi--history] size-5' />, text: 'History', to: '/library/history' },
        ].map(({ icon, text, to }) => (
          <SidebarLink active={isLinkActive(to)} key={text} to={to}>
            {icon}
            {text}
          </SidebarLink>
        ))}
      </div>

      <div className='mt-4'>
        <h3 className='flex items-center gap-2 px-4 text-sm text-white/50'>
          <span className='icon-[mdi--gamepad-classic] size-5' />
          Platforms
        </h3>

        <div className='mt-2 flex flex-col gap-y-2'>
          {platformLinks.map(({ icon, name, text, to }) => (
            <SidebarLink active={isLinkActive(to)} key={name} to={to}>
              {icon ? <img alt='icon' className='size-5' src={icon} /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
