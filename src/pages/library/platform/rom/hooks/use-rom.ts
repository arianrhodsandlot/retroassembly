import { use } from 'react'
import { RomContext } from '../components/rom-context.ts'

export function useRom() {
  const rom = use(RomContext)
  return rom
}
