'use client'
import { useHydrateAtoms } from 'jotai/utils'
import type { ReactNode } from 'react'
import type { Preference } from '@/constants/preference'
import { preferenceAtom } from '../atoms.ts'

export function AtomsHydrator({
  children,
  values: { preference },
}: { children: ReactNode; values: { preference: Preference } }) {
  useHydrateAtoms([[preferenceAtom, preference]])
  return children
}
