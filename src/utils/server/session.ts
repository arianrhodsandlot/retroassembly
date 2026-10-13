import { getContext } from 'hono/context-storage'
import { setCookie } from 'hono/cookie'
import { getRequestUrl } from './request-url.ts'

export function isSecureRequest() {
  return getRequestUrl().protocol === 'https:'
}

export function setSessionCookie(token: string, expires: Date, secure = isSecureRequest()) {
  const c = getContext()
  setCookie(c, 'token', token, {
    expires,
    httpOnly: true,
    path: '/',
    sameSite: 'Strict',
    secure,
  })
}
