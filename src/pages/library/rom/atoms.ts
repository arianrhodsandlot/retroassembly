import { atomWithReset } from 'jotai/utils'

export const showGameOverlayAtom = atomWithReset(false)
export const isGameOverlayPendingAtom = atomWithReset(false)
