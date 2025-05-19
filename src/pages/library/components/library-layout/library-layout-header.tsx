import { Select } from '@radix-ui/themes'
import { Link, useLocation, useNavigate } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { usePlatform } from '../../hooks/use-platform.ts'
import { usePreference } from '../../hooks/use-preference.ts'

export function LibraryLayoutHeader() {
  const { preference } = usePreference()
  const navitate = useNavigate()
  const platform = usePlatform()
  const location = useLocation()
  const isDemo = useIsDemo()

  const platforms = isDemo ? ['gba', 'gbc', 'genesis', 'nes', 'snes'] : preference.ui.platforms

  let currentRouteName = ''
  if (platform) {
    currentRouteName = platform.name
  } else if (location.pathname === '/library') {
    currentRouteName = 'library'
  } else if (location.pathname === '/library/history') {
    currentRouteName = 'history'
  }

  function handleValueChange(value: string) {
    if (value === 'library') {
      navitate('/library')
    } else if (value === 'history') {
      navitate('/library/history')
    } else {
      navitate(`/library/platform/${encodeURIComponent(value)}`)
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
            <Select.Group>
              <Select.Item value='library'>
                <div className='flex items-center gap-1'>
                  <span className='icon-[mdi--bookshelf] size-5' />
                  Library
                </div>
              </Select.Item>
              <Select.Item value='history'>
                <div className='flex items-center gap-1'>
                  <span className='icon-[mdi--history] size-5' />
                  History
                </div>
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              {platforms.map((platform) => (
                <Select.Item key={platform} value={platform}>
                  <div className='flex items-center gap-1'>
                    <img alt={platform} className='size-5' src={getPlatformIcon(platform)} />
                    {platformMap[platform].displayName}
                  </div>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </header>
  )
}
