import { atom } from 'jotai'
import type { ResolvedPreference } from '@/constants/preference.ts'

export const preferenceAtom = atom<ResolvedPreference>()
