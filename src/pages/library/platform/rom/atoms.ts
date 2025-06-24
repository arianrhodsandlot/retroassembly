import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export const isGameOverlayPendingAtom = atomWithReset(false)

const launchButtonPosition = atom<DOMRect>()
export function useLaunchButtonRect() {
  return useAtom(launchButtonPosition)
}

const isFullscreen = atom(false)
export function useIsFullscreen() {
  return useAtom(isFullscreen)
}
