import { getContext } from 'hono/context-storage'
import { authMiddleware } from './auth.ts'
import { cloudflareMiddleware } from './cloudflare.ts'
import { globalsMiddleware } from './globals.ts'
import { defineMiddleware, shouldApplyMiddlware } from './utils.ts'

export default defineMiddleware(function middleware(...args) {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      await next()
      return
    }

    await globalsMiddleware(...args)(ctx, next)
    await authMiddleware(...args)(ctx, next)

    const { redirected } = getContext().var

    if (!redirected) {
      await next()
      await cloudflareMiddleware(...args)(ctx, next)
    }
  }
})
