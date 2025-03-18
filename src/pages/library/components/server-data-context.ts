import { noop } from 'es-toolkit'
import { createContext, type Dispatch, type SetStateAction } from 'react'
import { defaultPreference } from '@/constants/preference.ts'

const defaultValue = {
  preference: defaultPreference,
}

export const ServerDataContext = createContext([
  defaultValue,
  noop as unknown as Dispatch<SetStateAction<typeof defaultValue>>,
] as const)
