import { createMiddleware } from 'hono/factory'
import { defaultRedirectTo } from '#@/constants/auth.ts'
import { stripBase, withBase } from '#@/utils/server/base-url.ts'

export function auth() {
  return createMiddleware(async (c, next) => {
    const { currentUser } = c.var

    const { origin, pathname, search } = new URL(c.req.raw.url)
    // Match against the app-relative path so auth still triggers when hosted under a base URL.
    const appPathname = stripBase(pathname)
    const needAuth = ['/library', '/library.data'].includes(appPathname) || appPathname.startsWith('/library/')
    if (!needAuth || currentUser) {
      await next()
      return
    }

    const redirectTo = `${appPathname}${search}`
    const loginUrl = new URL(withBase('/login'), origin)
    if (redirectTo !== defaultRedirectTo) {
      loginUrl.searchParams.set('redirect_to', redirectTo)
    }
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`

    return c.redirect(loginUrlPath)
  })
}
