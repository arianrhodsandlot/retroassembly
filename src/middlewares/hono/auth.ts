import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware(async (c, next) => {
  const { currentUser } = c.var

  const { origin, pathname, search } = new URL(c.req.raw.url)
  const needAuth = pathname === '/library' || pathname.startsWith('/library/')
  if (!needAuth || currentUser) {
    await next()
    return
  }

  const redirectTo = `${pathname}${search}`
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('redirect_to', redirectTo)
  const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`

  return c.redirect(loginUrlPath)
})
