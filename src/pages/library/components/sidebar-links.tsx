import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks() {
  const { preference } = getContextData()

  const platformLinks = preference.platforms.map((platform) => ({
    href: `/library/platform/${encodeURIComponent(platform)}`,
    icon: getPlatformIcon(platform, ''),
    name: platform,
    text: platformMap[platform].displayName,
  }))
  // .sort((a, b) => (a.text.codePointAt(0) ?? 0) - (b.text.codePointAt(0) ?? 0))

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        {[
          { href: '/library', icon: <span className='icon-[mdi--bookshelf] size-5' />, text: 'Library' },
          { href: '/library/history', icon: <span className='icon-[mdi--history] size-5' />, text: 'History' },
        ].map(({ href, icon, text }) => (
          <SidebarLink href={href} key={text}>
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
          {platformLinks.map(({ href, icon, name, text }) => (
            <SidebarLink href={href} key={name}>
              {icon ? <img alt='icon' className='size-5' src={icon} /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
