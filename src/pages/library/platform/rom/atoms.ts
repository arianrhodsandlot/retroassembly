import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export const isGameOverlayPendingAtom = atomWithReset(false)

const launchButtonAtom = atom<HTMLButtonElement>()
export function useLaunchButton() {
  return useAtom(launchButtonAtom)
}

const isFullscreenAtom = atom(false)
export function useIsFullscreen() {
  return useAtom(isFullscreenAtom)
}
