import { getContext } from 'hono/context-storage'
import { deleteCookie } from 'hono/cookie'
import { invalidateSession } from '@/controllers/invalidate-session.ts'

export async function loader() {
  const c = getContext()

  const { session, supabase } = c.var

  if (supabase) {
    await supabase.auth.signOut()
  }

  if (session) {
    await invalidateSession()
    deleteCookie(c, 'session')
  }

  return c.redirect('/')
}

export { noop as default } from 'es-toolkit'
