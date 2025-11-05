import { sortBy } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { useIsDemo } from './use-demo.ts'
import { usePlatform } from './use-platform.ts'
import { usePreference } from './use-preference.ts'

const demoPlatforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
export function useNavigationLinks() {
  const { t } = useTranslation()
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
    text: t(platformMap[platform].displayName),
    to: getPlatformLink(platform),
  }))

  const sortedPlatformLinks = sortBy(platformLinks, ['name'])

  const groups = [
    {
      links: [
        { iconClass: 'icon-[mdi--bookshelf]', iconUrl: '', name: 'library', text: t('Library'), to: `/${libraryPath}` },
      ],
      title: '',
    },
    { links: sortedPlatformLinks, title: t('platform_other') },
  ]
  if (!isDemo) {
    const historyLink = {
      iconClass: 'icon-[mdi--history]',
      iconUrl: '',
      name: 'history',
      text: t('History'),
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
