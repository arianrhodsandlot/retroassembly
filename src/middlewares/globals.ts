import { accepts } from 'hono/accepts'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import type { ResolvedPreference } from '@/constants/preference.ts'
import { getPreference } from '@/controllers/preference/get-preference.ts'
import { getCurrentUser } from '@/controllers/users/get-current-user.ts'
import { i18n } from '@/utils/isomorphic/i18n.ts'

declare module 'hono' {
  interface ContextVariableMap {
    authorized: boolean
    currentUser: { id: string }
    i18n: typeof i18n
    language: string
    preference: ResolvedPreference
    token: string
    unauthorized: boolean
  }
}

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

    const language = accepts(c, {
      default: 'en',
      header: 'Accept-Language',
      supports: ['en', 'fr', 'ja', 'ko', 'zh-CN'],
    })
    i18n.changeLanguage(language)
    c.set('language', language)
    c.set('i18n', i18n)

    await next()
  })
}
