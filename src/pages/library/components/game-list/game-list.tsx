import { useAtom } from 'jotai'
import type { RomsPagination } from '@/controllers/get-roms.ts'
import { romsAtom } from '../../atoms.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { GameEntry } from '../game-entry/game-entry.tsx'
import { GameListPagination } from './game-list-pagination.tsx' // Import the Pagination component

export function GameList({ pagination }: { pagination: RomsPagination }) {
  const [roms] = useAtom(romsAtom)
  const { preference } = usePreference()

  if (!roms || roms.length === 0) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-4xl text-zinc-300'>
        <span className='icon-[mdi--package-variant] size-14' />
        Nothing here yet.
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
    <div className='flex flex-col gap-4'>
      <div
        className='grid'
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(calc(var(--spacing)*${size}),1fr))` }}
      >
        {roms.map((rom) => (
          <GameEntry key={rom.id} rom={rom} />
        ))}
      </div>
      <GameListPagination pagination={pagination} />
    </div>
  )
}
