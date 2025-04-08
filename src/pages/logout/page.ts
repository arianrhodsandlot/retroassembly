import { getContext } from 'hono/context-storage'
import { redirectDocument } from 'react-router'

export async function loader() {
  const { supabase } = getContext().var
  await supabase?.auth.signOut()
  return redirectDocument('/')
}

export { noop as default } from 'es-toolkit'
