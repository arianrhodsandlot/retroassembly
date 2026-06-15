import { useLocation } from 'react-router'
import { libraryModeEnum } from '#@/databases/schema.ts'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { routes } from '../../../routes.ts'
import { useSelectedGames } from '../../atoms.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useRoms } from '../../hooks/use-roms.ts'

export function useGameListActions() {
  const { roms } = useRoms()
  const [selectedGames, setSelectedGames] = useSelectedGames()
  const { pathname, search } = useLocation()
  const isDemo = useIsDemo()
  const { currentUser } = useGlobalLoaderData()

  const isHistoryPage = pathname === routes.libraryHistory
  const isFavoritesPage = pathname === routes.libraryFavorites
  const isSharedLibrary = currentUser?.libraryMode === libraryModeEnum.shared
  const shouldHideActions = isDemo || isHistoryPage || isSharedLibrary

  const searchParams = new URLSearchParams(search)
  const direction = searchParams.get('direction') || 'asc'
  const isViewingFavorites = searchParams.get('favorite') === '1'
  const sort = searchParams.get('sort') || 'name'

  const hasRoms = roms.length > 0
  const hasSelectedGames = selectedGames.length > 0
  const canSelectAll = selectedGames.length < roms.length

  const showFavoriteButton = (!isFavoritesPage && hasRoms) || isViewingFavorites
  const showSortDropdown = hasRoms

  function buildSortLink(params: Record<string, string>) {
    const newParams = new URLSearchParams(params)
    if (isViewingFavorites) {
      newParams.set('favorite', '1')
    }
    return [pathname, newParams].join('?')
  }

  function getFavoriteToggleLink() {
    const params = new URLSearchParams(search)
    if (isViewingFavorites) {
      params.delete('favorite')
    } else {
      params.set('favorite', '1')
    }
    const query = params.toString()
    return query ? [pathname, query].join('?') : pathname
  }

  return {
    buildSortLink,
    canSelectAll,
    direction,
    getFavoriteToggleLink,
    hasRoms,
    hasSelectedGames,
    isDemo,
    isViewingFavorites,
    pathname,
    roms,
    search,
    selectedGames,
    setSelectedGames,
    shouldHideActions,
    showFavoriteButton,
    showSortDropdown,
    sort,
  }
}
