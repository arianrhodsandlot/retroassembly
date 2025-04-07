import type { SetStateAction, WritableAtom } from 'jotai'
import { preferenceAtom } from '@/pages/atoms.ts'
import { platformAtom, romAtom, romsAtom } from '../atoms.ts'

type HydrateAtoms = [WritableAtom<unknown, SetStateAction<any>[], unknown>, unknown][]
export function getHydrateAtoms({ override = [] }: { override?: HydrateAtoms } = {}) {
  const overrideMap = new WeakMap()
  for (const [atom, value] of override) {
    overrideMap.set(atom, value)
  }

  const defaultAtoms: HydrateAtoms = [
    [preferenceAtom, undefined],
    [platformAtom, undefined],
    [romsAtom, undefined],
    [romAtom, undefined],
  ]

  const atoms: HydrateAtoms = defaultAtoms.map(([atom, value]) => [atom, overrideMap.get(atom) ?? value])
  return atoms
}
