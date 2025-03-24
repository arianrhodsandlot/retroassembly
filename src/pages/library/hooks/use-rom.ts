import { useAtom } from 'jotai'
import { romAtom } from '@/pages/library/atoms.ts'
import { getRomGoodcodes } from '@/utils/library.ts'

export function useRom() {
  const [rom] = useAtom(romAtom)

  const goodcodes = getRomGoodcodes(rom)

  return { ...rom, goodcodes }
}
