'use client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import type { Roms, RomsPagination } from '@/controllers/get-roms.ts'
import { romsAtom } from '../atoms.ts'
import { GameEntry } from './game-entry.tsx'
import { GameListPagination } from './game-list-pagination.tsx' // Import the Pagination component

export function GameList({ pagination, roms: initialRoms }: { pagination: RomsPagination; roms: Roms }) {
  const [roms, setRoms] = useAtom(romsAtom)

  const renderedRoms = roms || initialRoms

  useEffect(() => {
    setRoms(initialRoms)
  }, [setRoms, initialRoms])

  return (
    <div>
      <div className='grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(calc(var(--spacing)*40),1fr))]'>
        {renderedRoms.map((rom) => (
          <GameEntry key={rom.id} rom={rom} />
        ))}
      </div>
      <GameListPagination pagination={pagination} />
    </div>
  )
}
