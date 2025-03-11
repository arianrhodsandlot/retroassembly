import { atom } from 'jotai'
import { defaultPreference, type Preference } from '@/constants/preference.ts'
import type { getRoms } from '@/controllers/get-roms'

export const serverDataAtom = atom<{ [key: string]: any; preference: Preference }>({
  preference: defaultPreference,
})

export const romsAtom = atom<Awaited<ReturnType<typeof getRoms>>>()
