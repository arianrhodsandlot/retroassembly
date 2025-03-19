'use client'
import { atom } from 'jotai'
import type { Preference } from '@/constants/preference'

export const preferenceAtom = atom<Preference>()
