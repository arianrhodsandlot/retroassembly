import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { getPreference } from '@/controllers/preference/get-preference.ts'
import { getCurrentUser } from '@/controllers/users/get-current-user.ts'

export function globals() {
  return createMiddleware(async function middleware(c, next) {
    c.set('authorized', false)
    c.set('unauthorized', true)

    const token = c.req.header('Authorization')?.replace('Bearer ', '') || getCookie(c, 'token') || ''
    c.set('token', token)

    const currentUser = await getCurrentUser()
    if (currentUser) {
      c.set('currentUser', currentUser)
      c.set('authorized', true)
      c.set('unauthorized', false)

      const preference = await getPreference()
      c.set('preference', preference)
    }

    await next()
  })
}
