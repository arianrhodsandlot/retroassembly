import { clsx } from 'clsx'
import { useNavigationLinks } from '../../hooks/use-navigation-links.ts'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks() {
  const { groups, isActive } = useNavigationLinks()

  return (
    <>
      {groups.map(({ links, title }) => (
        <div className='mt-4' key={title}>
          {title ? (
            <h3 className='flex items-center gap-2 px-4 text-sm text-white/50'>
              <span className='icon-[mdi--gamepad-classic] size-5 p-0.5' />
              {title}
            </h3>
          ) : null}

          <div className='mt-2 flex flex-col gap-y-2'>
            {links.map(({ iconClass, iconUrl, name, text, to }) => (
              <SidebarLink active={isActive(to)} key={name} to={to}>
                {iconClass ? <span className={clsx('size-5 p-0.5', iconClass)} /> : null}

                {iconUrl ? (
                  <div className={clsx({ '': !isActive(to) })}>
                    <img
                      alt={text}
                      className={clsx('size-6', {
                        invert: isActive(to) && ['ngp', 'wonderswan'].includes(name),
                      })}
                      src={iconUrl}
                    />
                  </div>
                ) : null}

                <span className={clsx({ 'group-hover:opacity-100 opacity-90': !isActive(to) })}>{text}</span>
              </SidebarLink>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
