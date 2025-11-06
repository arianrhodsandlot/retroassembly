import type { Context } from 'hono'
import { accepts } from 'hono/accepts'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { match } from 'path-to-regexp'
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
    t: typeof i18n.t
    token: string
    unauthorized: boolean
  }
}

const defaultLanguage = 'en'
const supportLanguages = Object.keys(i18n.options.resources || {})
function getLanguage(c: Context) {
  const { preference } = c.var

  const path = c.req.path.endsWith('.data') ? c.req.path.slice(0, -5) : c.req.path
  const segments = path.split('/').slice(1)
  const isDemo = match('/demo{/*path}')(path)
  const isLibrary = match('/library{/*path}')(path)
  const isHome = !isDemo && !isLibrary && match('/{:language}')(path)

  let language = defaultLanguage
  if (isHome) {
    language = segments[0] || defaultLanguage
  } else if (isLibrary || isDemo) {
    language =
      preference?.ui?.language ||
      accepts(c, { default: defaultLanguage, header: 'Accept-Language', supports: supportLanguages })
  }

  if (!supportLanguages.includes(language)) {
    language = defaultLanguage
  }

  return language
}

export function globals() {
  return createMiddleware(async function middleware(c, next) {
    const token = c.req.header('Authorization')?.replace('Bearer ', '') || getCookie(c, 'token') || ''
    c.set('token', token)

    const currentUser = await getCurrentUser()
    c.set('authorized', Boolean(currentUser))
    c.set('unauthorized', !currentUser)
    if (currentUser) {
      c.set('currentUser', currentUser)
      const preference = await getPreference()
      c.set('preference', preference)
    }

    const language = getLanguage(c)
    i18n.changeLanguage(language)
    c.set('language', language)
    c.set('i18n', i18n)
    c.set('t', i18n.t)

    await next()
  })
}
