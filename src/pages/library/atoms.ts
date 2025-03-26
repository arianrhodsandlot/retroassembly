'use client'
import { atom, useAtom } from 'jotai'
import type { CSSProperties } from 'react'
import type { Platform } from '@/constants/platform'
import type { Rom, Roms } from '@/controllers/get-roms'

export const romsAtom = atom<Roms>()
export const romAtom = atom<Rom>()
export const platformAtom = atom<Platform>()
export const settingsDialogOpenAtom = atom(false)

const focusIndicatorStyleAtom = atom<CSSProperties>({})
export function useFocusIndicatorStyle() {
  return useAtom(focusIndicatorStyleAtom)
}
