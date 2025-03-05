import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks({ platform }: { platform?: string }) {
  const { preference } = getContextData()

  const platformLinks = preference.ui.platforms
    .map((platform) => ({
      href: `/library/platform/${encodeURIComponent(platform)}`,
      icon: getPlatformIcon(platform, ''),
      name: platform,
      text: platformMap[platform].displayName,
    }))
    .sort((a, b) => (a.text.codePointAt(0) ?? 0) - (b.text.codePointAt(0) ?? 0))

  return (
    <>
      <div className='flex flex-col'>
        {[{ href: '/library', icon: <span className='icon-[mdi--bookshelf] size-5' />, text: 'Library' }].map(
          ({ href, icon, text }) => (
            <SidebarLink active={!platform} href={href} key={text}>
              <div className='flex size-5 items-center justify-center'>{icon}</div>
              {text}
            </SidebarLink>
          ),
        )}
      </div>

      <div className='mt-4'>
        <h3 className='px-4 text-white/60'>Platforms</h3>

        <div className='mt-2 flex flex-col gap-y-1'>
          {platformLinks.map(({ href, icon, name, text }) => (
            <SidebarLink active={platform === name} href={href} key={text}>
              {icon ? <img alt='icon' height='20' src={icon} width='20' /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
