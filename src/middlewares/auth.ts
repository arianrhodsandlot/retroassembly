import { createMiddleware } from 'hono/factory'
import { defaultRedirectTo } from '@/constants/auth.ts'

export function auth() {
  return createMiddleware(async function middleware(c, next) {
    const { currentUser } = c.var

    const { origin, pathname, search } = new URL(c.req.raw.url)
    const needAuth = ['/library', '/library.data'].includes(pathname) || pathname.startsWith('/library/')
    if (!needAuth || currentUser) {
      await next()
      return
    }

    const redirectTo = `${pathname}${search}`
    const loginUrl = new URL('/login', origin)
    if (redirectTo !== defaultRedirectTo) {
      loginUrl.searchParams.set('redirect_to', redirectTo)
    }
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`

    return c.redirect(loginUrlPath)
  })
}
