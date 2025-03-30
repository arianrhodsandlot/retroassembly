import { getContextData } from 'waku/middleware/context'
import { unstable_redirect } from 'waku/router/server'

export async function LogoutPage(): Promise<undefined> {
  const contextData = getContextData()
  const { supabase } = contextData
  await supabase?.auth.signOut()
  contextData.currentUser = undefined
  unstable_redirect('/')
}
