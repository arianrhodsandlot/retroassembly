import { serialize } from 'cookie'
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
    const serialized = serialize(name, value, options)
    const serialized2 = serializeCookieHeader(name, value, options)
    console.log(serialized, serialized2, serialized === serialized2)
    headers.append('Set-Cookie', serialized2)
  }

  throw redirectDocument(data?.url ?? '/login', { headers })
}

export { noop as default } from 'es-toolkit'
