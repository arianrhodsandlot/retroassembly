'use client'
import { atom } from 'jotai'
import type { Platform } from '@/constants/platform'
import type { Rom, Roms } from '@/controllers/get-roms'

export const romsAtom = atom<Roms>()
export const romAtom = atom<Rom>()
export const platformAtom = atom<Platform>()
export const settingsDialogOpenAtom = atom(false)
