import { atom, useAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import type { CSSProperties } from 'react'
import type { Roms } from '@/controllers/get-roms'

export const clientRomsAtom = atomWithReset<Roms | undefined>(undefined)
export function useClientRoms() {
  return [...useAtom(clientRomsAtom), useResetAtom(clientRomsAtom)] as const
}

export const settingsDialogOpenAtom = atom(false)

const aboutDialogOpenAtom = atom(false)
export function useAboutDialogOpen() {
  return useAtom(aboutDialogOpenAtom)
}

const focusIndicatorStyleAtom = atom<CSSProperties>({})
export function useFocusIndicatorStyle() {
  return useAtom(focusIndicatorStyleAtom)
}

export const showGameOverlayContentAtom = atomWithReset(false)
export function useShowGameOverlayContent() {
  return useAtom(showGameOverlayContentAtom)
}

export const isGameOverlayPendingAtom = atomWithReset(false)

const emulatorLaunchedAtom = atomWithReset(false)
export function useEmulatorLaunched() {
  return useAtom(emulatorLaunchedAtom)
}
