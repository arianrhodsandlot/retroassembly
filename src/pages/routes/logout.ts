import { getContext } from 'hono/context-storage'

export async function loader() {
  const c = getContext()
  const { supabase } = c.var
  await supabase?.auth.signOut()
  return c.redirect('/')
}

export { noop as default } from 'es-toolkit'
