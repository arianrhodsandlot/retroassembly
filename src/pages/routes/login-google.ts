import { getContext } from 'hono/context-storage'
import { withBase } from '#@/utils/server/base-url.ts'
import type { Route } from './+types/login-google.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const supabase = c.get('supabase')

  if (!supabase) {
    throw c.redirect('/')
  }

  // Absolute URL the OAuth provider redirects the browser back to (a document load), so it must
  // carry the base path explicitly rather than relying on React Router's basename.
  const oauthRedirectToURL = new URL(withBase('/login'), new URL(c.req.url).origin)
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect_to')
  if (redirectTo) {
    oauthRedirectToURL.searchParams.set('redirect_to', redirectTo)
  }

  const provider = 'google' as const

  const { data } = await supabase.auth.signInWithOAuth({
    options: { redirectTo: oauthRedirectToURL.href },
    provider,
  })

  throw c.redirect(data?.url ?? '/login')
}

export { noop as default } from 'es-toolkit'
