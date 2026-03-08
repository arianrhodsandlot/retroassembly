import { clsx } from 'clsx'
import { useState } from 'react'
import { DeleteDialog } from './delete-dialog.tsx'
import { FilterActions } from './filter-actions.tsx'
import { SelectionActions } from './selection-actions.tsx'
import { SelectionInfo } from './selection-info.tsx'
import { useGameListActions } from './use-game-list-actions.ts'

export function GameListActions() {
  const { roms, selectedGames, setSelectedGames, shouldHideActions, hasSelectedGames, canSelectAll } =
    useGameListActions()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (shouldHideActions) {
    return null
  }

  return (
    <div
      className={clsx('flex px-4', {
        'justify-between': hasSelectedGames,
        'justify-end': !hasSelectedGames,
      })}
    >
      {hasSelectedGames ? (
        <>
          <SelectionInfo
            selectedCount={selectedGames.length}
            canSelectAll={canSelectAll}
            onSelectAll={() => setSelectedGames(roms.map(({ id }) => id))}
          />
          <SelectionActions
            selectedCount={selectedGames.length}
            onDelete={() => setDeleteDialogOpen(true)}
            onCancel={() => setSelectedGames([])}
          />
          <DeleteDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} />
        </>
      ) : (
        <FilterActions />
      )}
    </div>
  )
}
