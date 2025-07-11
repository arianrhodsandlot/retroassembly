import { createMiddleware } from 'hono/factory'
import { getCurrentUser } from '@/controllers/get-current-user.ts'
import type { ResolvedPreference } from '../../constants/preference.ts'
import { getPreference } from '../../controllers/get-preference.ts'

declare module 'hono' {
  interface ContextVariableMap {
    currentUser: Awaited<ReturnType<typeof getCurrentUser>>
    preference: ResolvedPreference
  }
}

export function globals() {
  return createMiddleware(async function middleware(c, next) {
    const currentUser = await getCurrentUser()
    c.set('currentUser', currentUser)

    if (currentUser) {
      const preference = await getPreference()
      c.set('preference', preference)
    }

    await next()
  })
}
