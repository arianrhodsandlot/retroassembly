import { getContext } from 'hono/context-storage'
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

  throw c.redirect(data?.url ?? '/login')
}

export { noop as default } from 'es-toolkit'
