import { useMemo } from 'react'
import { useLoaderData } from 'react-router'
import { getRomGoodcodes } from '@/utils/library.ts'

export function useRom() {
  const { rom } = useLoaderData()

  const romWithGoodcodes = useMemo(() => (rom ? { ...rom, goodcodes: getRomGoodcodes(rom) } : undefined), [rom])

  return romWithGoodcodes
}
