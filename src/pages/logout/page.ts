import { getContextData } from 'waku/middleware/context'

export async function LogoutPage(): Promise<undefined> {
  const contextData = getContextData()
  const { redirect, supabase } = contextData
  await supabase?.auth.signOut()
  redirect('/')
}
