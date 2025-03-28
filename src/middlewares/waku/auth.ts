import type { Middleware } from 'waku/config'
import { getContextData } from 'waku/middleware/context'
import { shouldApplyMiddlware } from './utils.ts'

export default (function authMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    const { currentUser } = getContextData()

    const { pathname, search } = ctx.req.url
    const needAuth = pathname === '/library' || pathname.startsWith('/library/')
    if (!needAuth || currentUser) {
      return await next()
    }

    const isApi = pathname.startsWith('/api/')
    if (isApi) {
      return await next()
    }

    const redirectTo = `${pathname}${search}`
    const loginUrl = new URL('/login', ctx.req.url.origin)
    loginUrl.searchParams.set('redirect_to', redirectTo)
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`
    ctx.res.status = 302
    ctx.res.headers ??= {}
    ctx.res.headers.Location = loginUrlPath
  }
} as Middleware)
