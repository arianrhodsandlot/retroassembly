'use client'
import { atom } from 'jotai'
import type { ResolvedPreference } from '@/constants/preference'

export const preferenceAtom = atom<ResolvedPreference>()
export const currentPlatformAtom = atom<string>()
