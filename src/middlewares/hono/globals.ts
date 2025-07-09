import type { User } from '@supabase/supabase-js'
import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import type { ResolvedPreference } from '../../constants/preference.ts'
import { getPreference } from '../../controllers/get-preference.ts'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'

declare module 'hono' {
  interface ContextVariableMap {
    currentUser: User
    db: ReturnType<typeof createDrizzle>
    preference: ResolvedPreference
    storage: ReturnType<typeof createStorage>
    supabase?: ReturnType<typeof createSupabase>
  }
}

export const globalsMiddleware = createMiddleware(async (c, next) => {
  const db = createDrizzle()
  const storage = createStorage()
  const supabase = createSupabase()

  let currentUser: { id: string } | null = null
  const devUserId = c.req.query('dev_user_id') || env<{ DEV_USER_ID: string }>(c).DEV_USER_ID || '0'
  if (devUserId) {
    currentUser = { id: devUserId }
  } else if (supabase) {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      currentUser = data.user
    }
  }

  const contextData = { currentUser, db, storage, supabase }

  for (const key in contextData) {
    c.set(key, contextData[key])
  }

  if (currentUser) {
    const preference = await getPreference()
    c.set('preference', preference)
  }

  await next()
})
