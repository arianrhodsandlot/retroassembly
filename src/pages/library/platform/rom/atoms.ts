import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export const isGameOverlayPendingAtom = atomWithReset(false)

const launchButtonPositionAtom = atom<DOMRect>()
export function useLaunchButtonRect() {
  return useAtom(launchButtonPositionAtom)
}

const isFullscreenAtom = atom(false)
export function useIsFullscreen() {
  return useAtom(isFullscreenAtom)
}
