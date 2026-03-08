import { FavoriteButton } from './favorite-button.tsx'
import { SortDropdown } from './sort-dropdown.tsx'
import { useGameListActions } from './use-game-list-actions.ts'

export function FilterActions() {
  const {
    showFavoriteButton,
    showSortDropdown,
    isViewingFavorites,
    getFavoriteToggleLink,
    direction,
    sort,
    buildSortLink,
  } = useGameListActions()

  return (
    <div className='flex gap-2'>
      {showFavoriteButton && (
        <FavoriteButton isViewingFavorites={isViewingFavorites} getToggleLink={getFavoriteToggleLink} />
      )}
      {showSortDropdown && (
        <SortDropdown currentSort={sort} currentDirection={direction} buildSortLink={buildSortLink} />
      )}
    </div>
  )
}
