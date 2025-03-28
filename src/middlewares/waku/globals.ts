import type { Middleware } from 'waku/config'
import type { defaultPreference } from '../../constants/preference.ts'
import { getPreference } from '../../controllers/get-preference.ts'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'
import { shouldApplyMiddlware } from './utils.ts'

interface ContextData {
  currentUser: { id: string }
  db: ReturnType<typeof createDrizzle>
  preference: typeof defaultPreference
  redirect: (location: string, status?: number) => void
  storage: ReturnType<typeof createStorage>
  supabase?: ReturnType<typeof createSupabase>
}

declare module 'waku/middleware/context' {
  export function getContextData(): ContextData
}

export default (function globalsMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    const db = createDrizzle()
    const storage = createStorage()
    const supabase = createSupabase()
    const { data } = await supabase.auth.getUser()
    const currentUser = data?.user
    // const currentUser = { id: '567a53eb-c109-4142-8700-00f58db9853f' }

    function redirect(location: string, status?: number) {
      ctx.res.status = status ?? 302
      ctx.res.headers ??= {}
      ctx.res.headers.location = location
    }

    const contextData = { currentUser, db, redirect, storage, supabase }

    Object.assign(ctx.data, contextData)
    if (currentUser) { 
      const preference = await getPreference()
      Object.assign(ctx.data, { preference })
    }
    await next()
  }
} as Middleware)
