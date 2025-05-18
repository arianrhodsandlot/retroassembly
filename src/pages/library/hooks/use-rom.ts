import { useLoaderData } from 'react-router'
import { getRomGoodcodes } from '@/utils/library.ts'

export function useRom() {
  const { rom } = useLoaderData()

  return rom ? { ...rom, goodcodes: getRomGoodcodes(rom) } : undefined
}
