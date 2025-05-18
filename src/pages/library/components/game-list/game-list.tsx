import { useEffect } from 'react'
import type { RomsPagination } from '@/controllers/get-roms.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { useRoms } from '../../hooks/use-roms.ts'
import { GameEntry } from '../game-entry/game-entry.tsx'
import { GameListEmpty } from './game-list-empty.tsx'
import { GameListPagination } from './game-list-pagination.tsx' // Import the Pagination component

export function GameList({ pagination }: { pagination: RomsPagination }) {
  const { preference } = usePreference()
  const { resetClientRoms, roms } = useRoms()

  useEffect(() => resetClientRoms, [resetClientRoms])

  if (!roms || roms.length === 0) {
    return (
      <div className='border-t-1 border border-transparent border-t-black/20'>
        <GameListEmpty />
      </div>
    )
  }

  const sizeMap = {
    'extra-large': 60,
    'extra-small': 36,
    large: 54,
    medium: 48,
    small: 42,
  }

  const size = sizeMap[preference.ui.libraryCoverSize]

  return (
    <div className='border-t-1 flex flex-col gap-4 border border-transparent border-t-black/20 pt-4 [--min-width:150px] lg:[--min-width:100%]'>
      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(auto-fill,minmax(min(calc(var(--spacing)*${size}),var(--min-width)),1fr))`,
        }}
      >
        {roms.map((rom) => (
          <GameEntry key={rom.id} rom={rom} />
        ))}
      </div>
      <GameListPagination pagination={pagination} />
    </div>
  )
}
