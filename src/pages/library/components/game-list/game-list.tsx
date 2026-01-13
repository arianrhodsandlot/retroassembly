import { useEffect } from 'react'
import { useSelectedGames } from '../../atoms.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { useRoms } from '../../hooks/use-roms.ts'
import { GameEntry } from '../game-entry/game-entry.tsx'
import { GameListActions } from './game-list-actions.tsx'
import { GameListEmpty } from './game-list-empty.tsx'
import { GameListPagination } from './game-list-pagination.tsx' // Import the Pagination component

export function GameList() {
  const { preference } = usePreference()
  const { roms } = useRoms()
  const [, setSelectedGames] = useSelectedGames()

  useEffect(() => {
    setSelectedGames([])
  }, [setSelectedGames])

  if (!roms?.length) {
    return (
      <div className='border border-transparent border-t-(--gray-6)'>
        <GameListEmpty />
      </div>
    )
  }

  const sizeMap = { 'extra-large': 60, 'extra-small': 36, large: 54, medium: 48, small: 42 }
  const size = sizeMap[preference.ui.libraryCoverSize]
  const gridTemplateColumns = `repeat(auto-fill,minmax(min(calc(var(--spacing)*${size}),var(--min-width)),1fr))`

  return (
    <div className='flex flex-col border border-transparent border-t-(--gray-6) pt-4'>
      <GameListActions />
      <div className='mt-4 grid [--min-width:150px] lg:[--min-width:100%]' style={{ gridTemplateColumns }}>
        {roms.map((rom) => (
          <GameEntry key={rom.id} rom={rom} />
        ))}
      </div>
      <GameListPagination />
    </div>
  )
}
