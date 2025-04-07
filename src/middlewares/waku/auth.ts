import { getContext } from 'hono/context-storage'
import { defineMiddleware } from './utils.ts'

export const authMiddleware = defineMiddleware(() => {
  return async (ctx) => {
    const { currentUser, redirect } = getContext().var

    const { pathname, search } = ctx.req.url
    const needAuth = pathname === '/library' || pathname.startsWith('/library/')
    if (!needAuth || currentUser) {
      return
    }

    const isApi = pathname.startsWith('/api/')
    if (isApi) {
      return
    }

    const redirectTo = `${pathname}${search}`
    const loginUrl = new URL('/login', ctx.req.url.origin)
    loginUrl.searchParams.set('redirect_to', redirectTo)
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`
    redirect(loginUrlPath)

    await Promise.resolve()
  }
})
