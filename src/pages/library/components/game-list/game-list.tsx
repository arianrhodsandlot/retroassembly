'use client'
import { HydrationBoundary } from 'jotai-ssr'
import type { Roms, RomsPagination } from '@/controllers/get-roms.ts'
import { romsAtom } from '../../atoms.ts'
import { GameListContent } from './game-list-content.tsx'

export function GameList({ pagination, roms }: { pagination: RomsPagination; roms: Roms }) {
  return (
    <HydrationBoundary hydrateAtoms={[[romsAtom, roms]]} options={{ enableReHydrate: true }}>
      <GameListContent pagination={pagination} />
    </HydrationBoundary>
  )
}
