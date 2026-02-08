import { sortBy } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { generatePath, useLocation } from 'react-router'
import { platformMap } from '#@/constants/platform.ts'
import { routes } from '#@/pages/routes.ts'
import { getPlatformIcon } from '#@/utils/client/library.ts'
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
      links: isDemo
        ? [
            {
              iconClass: 'icon-[mdi--home]',
              iconUrl: '',
              name: 'home',
              text: t('Games'),
              to: generatePath(routes.demoHome),
            },
          ]
        : [
            {
              iconClass: 'icon-[mdi--home]',
              iconUrl: '',
              name: 'home',
              text: t('Home'),
              to: generatePath(routes.libraryHome),
            },
            {
              iconClass: 'icon-[mdi--bookshelf]',
              iconUrl: '',
              name: 'library',
              text: t('Games'),
              to: generatePath(routes.libraryRoms),
            },
            {
              iconClass: 'icon-[mdi--star]',
              iconUrl: '',
              name: 'favorites',
              text: t('Favorites'),
              to: generatePath(routes.libraryFavorites),
            },
            {
              iconClass: 'icon-[mdi--history]',
              iconUrl: '',
              name: 'history',
              text: t('History'),
              to: generatePath(routes.libraryHistory),
            },
          ],
      title: '',
    },
    { links: sortedPlatformLinks, title: t('platform_other') },
  ]

  function isActive(link: string) {
    return location.pathname === link || getPlatformLink(platform?.name) === link
  }

  function getPlatformLink(platform?: string) {
    if (!platform) {
      return ''
    }
    return generatePath(isDemo ? routes.demoPlatform : routes.libraryPlatform, { platform })
  }

  return { groups, isActive }
}
