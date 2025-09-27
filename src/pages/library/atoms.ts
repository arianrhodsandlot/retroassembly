import { atom, useAtom } from 'jotai'
import type { CSSProperties } from 'react'

const focusIndicatorStyleAtom = atom<CSSProperties>({})
export function useFocusIndicatorStyle() {
  return useAtom(focusIndicatorStyleAtom)
}

export const showGameOverlayContentAtom = atom(false)
export function useShowGameOverlayContent() {
  return useAtom(showGameOverlayContentAtom)
}

export const isGameOverlayPendingAtom = atom(false)

const emulatorLaunchedAtom = atom(false)
export function useEmulatorLaunched() {
  return useAtom(emulatorLaunchedAtom)
}

const suppressLoadingMaskAtom = atom(false)
export function useShouldSuppressLoadingMaskAtom() {
  return useAtom(suppressLoadingMaskAtom)
}

const spatialNavigationPaused = atom(false)
export function useSpatialNavigationPaused() {
  return useAtom(spatialNavigationPaused)
}

const selectedGamesAtom = atom<string[]>([])
export function useSelectedGames() {
  return useAtom(selectedGamesAtom)
}

const pristineAtom = atom(true)
export function usePristine() {
  return useAtom(pristineAtom)
}

const settingsDialogOpenAtom = atom(false)
export function useSettingsDialogOpen() {
  return useAtom(settingsDialogOpenAtom)
}

const settingsDialogTabNameAtom = atom('library')
export function useSettingsDialogTabName() {
  return useAtom(settingsDialogTabNameAtom)
}
