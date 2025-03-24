'use client'
import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { romAtom } from '@/pages/library/atoms.ts'

export function RomAtomGuard({ children }: { children: ReactNode }) {
  const [rom] = useAtom(romAtom)
  if (rom) {
    return children
  }
}
