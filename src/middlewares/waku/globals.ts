import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'
import type { defaultPreference } from '../../constants/preference.ts'
import { getPreference } from '../../controllers/get-preference.ts'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'
import { defineMiddleware } from './utils.ts'

interface ContextData {
  currentUser: { id: string }
  db: ReturnType<typeof createDrizzle>
  preference: typeof defaultPreference
  redirect: (location: string, status?: number) => void
  redirected?: true
  storage: ReturnType<typeof createStorage>
  supabase?: ReturnType<typeof createSupabase>
}

export const globalsMiddleware = defineMiddleware(() => {
  return async (ctx) => {
    const c = getHonoContext()
    const db = createDrizzle()
    const storage = createStorage()
    const supabase = createSupabase()

    let currentUser: { id: string } | null = null
    const devUserId = env<{ DEV_USER_ID: string }>(c).DEV_USER_ID
    if (devUserId) {
      currentUser = { id: devUserId }
    } else if (supabase) {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        currentUser = data.user
      }
    }

    function redirect(location: string, status?: number) {
      ctx.res.status = status ?? 302
      ctx.res.headers ??= {}
      ctx.res.headers.location = location
      Object.assign(ctx.data, { redirected: true })
    }

    const contextData = { currentUser, db, redirect, storage, supabase }

    Object.assign(ctx.data, contextData)
    if (currentUser) {
      const preference = await getPreference()
      Object.assign(ctx.data, { preference })
    }
  }
})
