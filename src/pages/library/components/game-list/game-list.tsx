'use client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import type { Roms, RomsPagination } from '@/controllers/get-roms.ts'
import { romsAtom } from '../../atoms.ts'
import { GameEntry } from '../game-entry/game-entry.tsx'
import { GameListPagination } from './game-list-pagination.tsx' // Import the Pagination component

export function GameList({ pagination, roms: initialRoms }: { pagination: RomsPagination; roms: Roms }) {
  const [roms, setRoms] = useAtom(romsAtom)

  const renderedRoms = roms || initialRoms

  useEffect(() => {
    setRoms(initialRoms)
  }, [setRoms, initialRoms])

  if (renderedRoms.length === 0) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-4xl text-zinc-300'>
        <span className='icon-[mdi--package-variant] size-14' />
        Nothing here yet.
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid gap-x-4 gap-y-2 [grid-template-columns:repeat(auto-fill,minmax(calc(var(--spacing)*40),1fr))]'>
        {renderedRoms.map((rom) => (
          <GameEntry key={rom.id} rom={rom} />
        ))}
      </div>
      <GameListPagination pagination={pagination} />
    </div>
  )
}
