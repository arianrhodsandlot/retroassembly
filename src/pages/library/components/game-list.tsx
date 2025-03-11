'use client'
import { useMeasure } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { romsAtom } from '../atoms.ts'
import { GameEntry } from './game-entry.tsx'

const minWidth = 180

function getChildWidth(width?: number) {
  if (width) {
    if (width <= minWidth) {
      return minWidth
    }
    let i = 1
    while (width / i >= minWidth) {
      i += 1
    }
    return Math.floor(width / i)
  }
}

export function GameList({ roms: initialRoms }: { roms: any[] }) {
  const [measurements, ref] = useMeasure<HTMLDivElement>(true)
  const childWidth = getChildWidth(measurements?.width)
  const [roms, setRoms] = useAtom(romsAtom)

  useEffect(() => {
    setRoms(initialRoms)
  }, [setRoms, initialRoms])

  return (
    <div className='flex flex-wrap items-start gap-y-4' ref={ref}>
      {childWidth ? roms.map((rom) => <GameEntry key={rom.id} rom={rom} width={childWidth} />) : null}
    </div>
  )
}
