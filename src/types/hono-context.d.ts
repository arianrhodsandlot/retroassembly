import type { ResolvedPreference } from '@/constants/preference.ts'

declare module 'hono' {
  interface ContextVariableMap {
    authorized: boolean
    currentUser: { id: string }
    preference: ResolvedPreference
    token: string
    unauthorized: boolean
  }
}
