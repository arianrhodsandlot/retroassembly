import { noop } from 'es-toolkit'
import { createContext } from 'react'
import { defaultPreference } from '@/constants/preference.ts'

const defaultValue = {
  preference: defaultPreference,
}

export const ServerDataContext = createContext([defaultValue, noop])
