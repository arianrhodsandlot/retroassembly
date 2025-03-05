import { useAtom } from 'jotai'
import { preferenceAtom } from '../atoms.ts'

export function usePreference() {
  const [preference] = useAtom(preferenceAtom)

  if (!preference) {
    throw new Error('preference is invalid')
  }

  return preference
}
