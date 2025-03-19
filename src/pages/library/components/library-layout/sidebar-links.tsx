'use client'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks() {
  const { preference } = usePreference()

  const platformLinks = preference.ui.platforms.map((platform) => ({
    icon: getPlatformIcon(platform, ''),
    name: platform,
    text: platformMap[platform].displayName,
    to: `/library/platform/${encodeURIComponent(platform)}`,
  }))

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        {[
          { icon: <span className='icon-[mdi--bookshelf] size-5' />, text: 'Library', to: '/library' },
          { icon: <span className='icon-[mdi--history] size-5' />, text: 'History', to: '/library/history' },
        ].map(({ icon, text, to }) => (
          <SidebarLink key={text} to={to}>
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
            <SidebarLink key={name} to={to}>
              {icon ? <img alt='icon' className='size-5' src={icon} /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
