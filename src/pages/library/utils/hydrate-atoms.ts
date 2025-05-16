import type { SetStateAction, WritableAtom } from 'jotai'
import { preferenceAtom } from '@/pages/atoms.ts'
import { platformAtom, romAtom, romsAtom } from '../atoms.ts'

const atomConfigs = [
  { atom: platformAtom, enableRehydrate: true },
  { atom: preferenceAtom, enableRehydrate: false },
  { atom: romAtom, enableRehydrate: true },
  { atom: romsAtom, enableRehydrate: true },
]

type HydrateAtoms = [WritableAtom<unknown, SetStateAction<any>[], unknown>, unknown][]
export function getHydrateAtoms(overrideAtoms: HydrateAtoms) {
  const map = new WeakMap(overrideAtoms)
  return atomConfigs.map(({ atom, enableRehydrate }) => ({
    atom,
    enableRehydrate,
    value: map.get(atom),
  }))
}
