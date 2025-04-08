import { getContext } from 'hono/context-storage'
import { redirectDocument } from 'react-router'
import { serializeCookieHeader } from '@/utils/misc.ts'
import type { Route } from './+types/page'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const supabase = c.get('supabase')

  if (!supabase) {
    return
  }

  const oauthRedirectToURL = new URL('/login', new URL(c.req.url).origin)
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect_to')
  if (redirectTo) {
    oauthRedirectToURL.searchParams.set('redirect_to', redirectTo.toString())
  }

  const provider = 'google' as const

  const { data } = await supabase.auth.signInWithOAuth({
    options: { redirectTo: oauthRedirectToURL.href },
    provider,
  })

  const headers = new Headers()
  const cookiesToSet = c.get('cookiesToSet') || []
  for (const { name, options, value } of cookiesToSet) {
    headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
  }

  throw redirectDocument(data?.url ?? '/login', { headers })
}
