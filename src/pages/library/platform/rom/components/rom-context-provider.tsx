'use client'
import { RomContext } from './rom-context.ts'

export function RomContextProvider({ children, value }) {
  return <RomContext value={value}>{children}</RomContext>
}
