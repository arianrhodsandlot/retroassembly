import { atom, useAtom } from 'jotai'

const isGameOverlayPendingAtom = atom(false)
export function useIsGameOverlayPendingAtom() {
  return useAtom(isGameOverlayPendingAtom)
}

const launchButtonAtom = atom<HTMLButtonElement>()
export function useLaunchButton() {
  return useAtom(launchButtonAtom)
}

const isFullscreenAtom = atom(false)
export function useIsFullscreen() {
  return useAtom(isFullscreenAtom)
}
