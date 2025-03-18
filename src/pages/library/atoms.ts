import { atom } from 'jotai'
import { defaultPreference, type Preference } from '@/constants/preference.ts'
import type { Roms } from '@/controllers/get-roms'

export const serverDataAtom = atom<{ [key: string]: any; preference: Preference }>({
  preference: defaultPreference,
})

export const romsAtom = atom<Roms>()

export const settingsDialogOpenAtom = atom(false)
