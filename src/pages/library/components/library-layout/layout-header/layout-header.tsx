import { Select } from '@radix-ui/themes'
import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router'
import { useNavigationLinks } from '../../../hooks/use-navigation-links.ts'
import { LayoutMenu } from '../layout-menu/layout-menu.tsx'
import { HeaderLinkItem } from './header-link-item.tsx'

export function LayoutHeader() {
  const navitate = useNavigate()
  const { groups, isActive } = useNavigationLinks()

  const groupLinks = groups.flatMap(({ links }) => links)
  const currentLink = groupLinks.find(({ to }) => isActive(to))
  const currentRouteName = currentLink?.name

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
          <Select.Trigger className='!text-white' variant='ghost'>
            <HeaderLinkItem link={currentLink} />
          </Select.Trigger>
          <Select.Content>
            {groups.map(({ links, title }, i) => (
              <Fragment key={title}>
                <Select.Group>
                  {links.map((link) => (
                    <Select.Item key={link.name} value={link.name}>
                      <HeaderLinkItem link={link} />
                    </Select.Item>
                  ))}
                </Select.Group>
                {i < groups.length - 1 ? <Select.Separator /> : null}
              </Fragment>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <LayoutMenu />
    </header>
  )
}
