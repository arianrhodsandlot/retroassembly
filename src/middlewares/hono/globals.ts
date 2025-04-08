import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import type { defaultPreference } from '../../constants/preference.ts'
import { getPreference } from '../../controllers/get-preference.ts'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'

declare module 'hono' {
  interface ContextVariableMap {
    currentUser: { id: string }
    db: ReturnType<typeof createDrizzle>
    preference: typeof defaultPreference
    redirected?: true
    storage: ReturnType<typeof createStorage>
    supabase?: ReturnType<typeof createSupabase>
  }
}

export const globalsMiddleware = createMiddleware(async (c, next) => {
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
