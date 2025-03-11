'use client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { romsAtom } from '../atoms.ts'
import { GameEntry } from './game-entry.tsx'

export function GameList({ roms: initialRoms }: { roms: any[] }) {
  const [roms, setRoms] = useAtom(romsAtom)

  const renderedRoms = roms || initialRoms

  useEffect(() => {
    setRoms(initialRoms)
  }, [setRoms, initialRoms])

  return (
    <div className='grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(calc(var(--spacing)*40),1fr))]'>
      {renderedRoms.map((rom) => (
        <GameEntry key={rom.id} rom={rom} />
      ))}
    </div>
  )
}
