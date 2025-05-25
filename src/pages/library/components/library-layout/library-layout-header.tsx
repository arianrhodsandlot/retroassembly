import { Select } from '@radix-ui/themes'
import clsx from 'clsx'
import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router'
import { useNavigationLinks } from '../../hooks/use-navigation-links.ts'

export function LibraryLayoutHeader() {
  const navitate = useNavigate()
  const { groups, isActive } = useNavigationLinks()

  const groupLinks = groups.flatMap(({ links }) => links)
  const currentRouteName = groupLinks.find(({ to }) => isActive(to))?.name

  function handleValueChange(value: string) {
    const link = groupLinks.find(({ name }) => name === value)
    if (link?.to) {
      navitate(link.to)
    }
  }

  return (
    <header className='flex items-center px-2 py-4 lg:hidden'>
      <Link className='absolute flex items-center gap-2 font-bold' reloadDocument to='/'>
        <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
      </Link>

      <div className='flex h-5 flex-1 justify-center'>
        <Select.Root onValueChange={handleValueChange} size='2' value={currentRouteName}>
          <Select.Trigger className='!text-white' variant='ghost' />
          <Select.Content>
            {groups.map(({ links, title }, i) => (
              <Fragment key={title}>
                <Select.Group>
                  {links.map(({ iconClass, iconUrl, name, text }) => (
                    <Select.Item key={name} value={name}>
                      <div className='flex items-center gap-1'>
                        {iconClass ? <span className={clsx('size-5', iconClass)} /> : null}
                        {iconUrl ? <img alt={text} className='size-5' src={iconUrl} /> : null}
                        {text}
                      </div>
                    </Select.Item>
                  ))}
                </Select.Group>
                {i < groups.length - 1 ? <Select.Separator /> : null}
              </Fragment>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    </header>
  )
}
