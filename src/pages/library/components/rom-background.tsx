import type { HTMLAttributes } from 'react'
import { useRomCover } from '../hooks/use-rom-cover.ts'
import { MainBackground } from './main-background.tsx'

export function RomBackground({ rom, ...props }: { rom?: any } & HTMLAttributes<HTMLDivElement>) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading || !rom) {
    return
  }

  return cover?.type === 'rom' ? <MainBackground alt={rom.name} src={cover.src} {...props} /> : null
}
