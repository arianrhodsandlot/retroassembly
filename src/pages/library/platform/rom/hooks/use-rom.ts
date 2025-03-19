import { use } from 'react'
import { RomContext } from '../components/rom-context.ts'

export function useRom() {
  const rom = use(RomContext)
  if (!rom) {
    throw new Error('useRom must be used within a RomProvider')
  }
  return rom
}
