'use server'
import { getContext } from 'hono/context-storage'

export async function getLoginUrl(formData: FormData) {
  const { req } = getContext()
  const { supabase } = getContext().var

  if (!supabase) {
    return
  }

  const oauthRedirectToURL = new URL('/login', new URL(req.url).origin)
  const redirectTo = formData.get('redirect_to')
  if (redirectTo) {
    oauthRedirectToURL.searchParams.set('redirect_to', redirectTo.toString())
  }

  const provider = 'google' as const

  const { data } = await supabase.auth.signInWithOAuth({
    options: { redirectTo: oauthRedirectToURL.href },
    provider,
  })

  return data?.url
}
