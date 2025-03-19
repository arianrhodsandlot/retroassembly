'use client'
import type { WritableAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { PropsWithChildren } from 'react'

export function HydrateAtoms({
  atoms,
  children,
}: PropsWithChildren<{ atoms: [WritableAtom<unknown, never[], unknown>, unknown][] }>) {
  useHydrateAtoms(atoms)

  return <>{children}</>
}
