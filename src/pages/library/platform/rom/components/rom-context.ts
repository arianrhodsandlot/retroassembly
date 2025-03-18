import { createContext } from 'react'
import type { Rom } from '@/controllers/get-roms.ts'

export const RomContext = createContext<null | Rom>(null)
