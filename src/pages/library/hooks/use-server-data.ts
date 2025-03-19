import { use } from 'react'
import { PreferenceContext } from '../components/preference-context/preference-context.ts'

export function useServerData() {
  const serverData = use(PreferenceContext)
  return serverData
}
