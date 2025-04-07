import { getContext } from 'hono/context-storage'

export async function LogoutPage(): Promise<undefined> {
  const contextData = getContext().var
  const { redirect, supabase } = contextData
  await supabase?.auth.signOut()
  redirect('/')
}
