import { useAtom } from 'jotai'
import { romAtom } from '@/pages/library/atoms.ts'

export function useRom() {
  const [rom] = useAtom(romAtom)
  if (!rom) {
    throw new Error('rom should not be empty')
  }
  return rom
}
