import { useLocation } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { useIsDemo } from './use-demo.ts'
import { usePlatform } from './use-platform.ts'
import { usePreference } from './use-preference.ts'

const demoPlatforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
export function useNavigationLinks() {
  const { preference } = usePreference()
  const platform = usePlatform()
  const location = useLocation()
  const isDemo = useIsDemo()
  const platforms = isDemo ? demoPlatforms : preference.ui.platforms
  const libraryPath = isDemo ? 'demo' : 'library'

  const platformLinks = platforms.map((platform) => ({
    iconClass: '',
    iconUrl: getPlatformIcon(platform),
    name: platform,
    text: platformMap[platform].displayName,
    to: getPlatformLink(platform),
  }))

  const groups = [
    {
      links: [
        { iconClass: 'icon-[mdi--bookshelf]', iconUrl: '', name: 'library', text: 'Library', to: `/${libraryPath}` },
      ],
      title: '',
    },
    { links: platformLinks, title: 'Platforms' },
  ]
  if (!isDemo) {
    const historyLink = {
      iconClass: 'icon-[mdi--history]',
      iconUrl: '',
      name: 'history',
      text: 'History',
      to: `/${libraryPath}/history`,
    }
    groups[0].links.push(historyLink)
  }

  function isActive(link: string) {
    return location.pathname === link || getPlatformLink(platform?.name) === link
  }

  function getPlatformLink(platform?: string) {
    if (!platform) {
      return ''
    }
    return `/${encodeURIComponent(libraryPath)}/platform/${encodeURIComponent(platform)}`
  }

  return { groups, isActive }
}
