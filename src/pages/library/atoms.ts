'use client'
import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import type { CSSProperties } from 'react'
import type { Platform } from '@/constants/platform'
import type { Rom, Roms } from '@/controllers/get-roms'

export const romsAtom = atom<Roms>()
export const romAtom = atom<Rom>()
export const platformAtom = atom<Platform>()
export function usePlatform() {
  return useAtom(platformAtom)
}
export const settingsDialogOpenAtom = atom(false)

const focusIndicatorStyleAtom = atom<CSSProperties>({})
export function useFocusIndicatorStyle() {
  return useAtom(focusIndicatorStyleAtom)
}

export const showGameOverlayAtom = atomWithReset(false)
export function useShowGameOverlay() {
  return useAtom(showGameOverlayAtom)
}

export const isGameOverlayPendingAtom = atomWithReset(false)

const emulatorLaunchedAtom = atomWithReset(false)
export function useEmulatorLaunched() {
  return useAtom(emulatorLaunchedAtom)
}

const showPendingMaskAtom = atom(false)
export function useShowPendingMaskAtom() {
  return useAtom(showPendingMaskAtom)
}
