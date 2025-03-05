import { atomWithReset } from 'jotai/utils'
import type { Nostalgist } from 'nostalgist'
import type { CoreName } from '@/constants/core'

export const emulatorAtom = atomWithReset<Nostalgist | undefined>(undefined)
export const emulatorStatusAtom = atomWithReset<'initial' | 'paused' | 'running' | 'terminated'>('initial')
export const emulatorResouceAtom = atomWithReset<{ core?: CoreName; rom?: any }>({})
