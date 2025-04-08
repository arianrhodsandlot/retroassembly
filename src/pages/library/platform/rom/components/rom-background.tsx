import { MainBackground } from '../../../components/main-background.tsx'
import { useRomCover } from '../../../hooks/use-rom-cover.ts'

export function RomBackground({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return
  }

  return cover?.type === 'rom' ? <MainBackground alt={rom.name} src={cover.src} /> : null
}
