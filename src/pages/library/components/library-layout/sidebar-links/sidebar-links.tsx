import { clsx } from 'clsx'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useNavigationLinks } from '../../../hooks/use-navigation-links.ts'
import { SearchButton } from './search-button.tsx'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks() {
  const { groups, isActive } = useNavigationLinks()
  const isDemo = useIsDemo()

  function shouldShowsSearchButton(name: string) {
    return !isDemo && name === 'library'
  }

  return (
    <div className='w-72'>
      {groups.map(({ links, title }, index) => (
        <div className={clsx({ 'mt-4': index })} key={title}>
          {title ? (
            <h3 className='flex items-center gap-2 px-4 text-sm capitalize text-white/50'>
              <span className='icon-[mdi--gamepad-classic] size-5 p-0.5' />
              {title}
            </h3>
          ) : null}

          <div className={clsx('flex w-full flex-col gap-y-2 overflow-hidden', { 'mt-2': title })}>
            {links.map(({ iconClass, iconUrl, name, text, to }) => (
              <div className='relative flex items-center' key={name}>
                <SidebarLink active={isActive(to)} title={text} to={to}>
                  {iconClass ? <span className={clsx('size-5 p-0.5', iconClass)} /> : null}

                  {iconUrl ? (
                    <img
                      alt={text}
                      className={clsx('block size-6', { invert: isActive(to) && ['ngp', 'wonderswan'].includes(name) })}
                      src={iconUrl}
                    />
                  ) : null}

                  <span className={clsx('truncate', { 'group-hover:opacity-100 opacity-90': !isActive(to) })}>
                    {text}
                  </span>
                </SidebarLink>

                {shouldShowsSearchButton(name) ? <SearchButton /> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
