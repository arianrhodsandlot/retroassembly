import { getContextData } from 'waku/middleware/context'
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

    const { redirected } = getContextData()

    if (!redirected) {
      await next()
      await cloudflareMiddleware(...args)(ctx, next)
    }
  }
})
