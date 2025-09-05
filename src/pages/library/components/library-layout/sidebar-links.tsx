import { Tooltip } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useSpatialNavigationPaused } from '../../atoms.ts'
import { useNavigationLinks } from '../../hooks/use-navigation-links.ts'
import { useShowSearchModal } from './atoms.ts'
import { SidebarLink } from './sidebar-link.tsx'

export function SidebarLinks() {
  const { groups, isActive } = useNavigationLinks()
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  function handleClickSearch() {
    setSpatialNavigationPaused(true)
    setShowSearchModal(true)
  }

  return (
    <>
      {groups.map(({ links, title }, index) => (
        <div className={clsx({ 'mt-4': index })} key={title}>
          {title ? (
            <h3 className='flex items-center gap-2 px-4 text-sm text-white/50'>
              <span className='icon-[mdi--gamepad-classic] size-5 p-0.5' />
              {title}
            </h3>
          ) : null}

          <div className={clsx('flex flex-col gap-y-2', { 'mt-2': title })}>
            {links.map(({ iconClass, iconUrl, name, text, to }) => (
              <div className='relative flex items-center' key={name}>
                <SidebarLink active={isActive(to)} to={to}>
                  {iconClass ? <span className={clsx('size-5 p-0.5', iconClass)} /> : null}

                  {iconUrl ? (
                    <div>
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

                {name === 'library' ? (
                  <Tooltip content='Search (Ctrl + K)'>
                    <button
                      aria-label='Search'
                      className='leading-0 absolute right-1 rounded p-2 opacity-90 hover:bg-black/10 hover:opacity-100'
                      onClick={handleClickSearch}
                      type='button'
                    >
                      <span className='icon-[mdi--search] size-5 p-0.5' />
                    </button>
                  </Tooltip>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
