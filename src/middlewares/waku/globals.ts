import type { Middleware } from 'waku/config'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'
import { shouldApplyMiddlware } from './utils.ts'

declare module 'waku/middleware/context' {
  export function getContextData(): {
    currentUser: { id: string }
    db: ReturnType<typeof createDrizzle>
    redirect: (location: string, status?: number) => undefined
    storage: ReturnType<typeof createStorage>
    supabase?: ReturnType<typeof createSupabase>
  }
}

export default (function globalsMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    function redirect(location: string, status = 302) {
      ctx.res.status = status
      ctx.res.headers ??= {}
      ctx.res.headers.location = location
    }

    ctx.data.redirect = redirect
    ctx.data.db = createDrizzle()
    ctx.data.storage = createStorage()
    ctx.data.supabase = createSupabase()

    // const { data } = await ctx.data.supabase.auth.getUser()
    // ctx.data.currentUser = data?.user
    ctx.data.currentUser = { id: '567a53eb-c109-4142-8700-00f58db9853f' }

    await next()
  }
} as Middleware)
