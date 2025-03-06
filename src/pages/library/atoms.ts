import { atom } from 'jotai'
import { defaultPreference, type Preference } from '@/constants/preference.ts'

export const serverDataAtom = atom<{ [key: string]: any; preference: Preference }>({
  preference: defaultPreference,
})
