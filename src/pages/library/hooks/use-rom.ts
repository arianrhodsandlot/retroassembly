import { useAtom } from 'jotai'
import { romAtom } from '@/pages/library/atoms.ts'
import { getRomGoodcodes } from '@/utils/library.ts'

export function useRom() {
  const [rom] = useAtom(romAtom)

  return rom ? { ...rom, goodcodes: getRomGoodcodes(rom) } : undefined
}
