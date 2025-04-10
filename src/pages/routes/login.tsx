import { getContext } from 'hono/context-storage'
import { LoginPage } from '../login/page.tsx'
import type { Route } from './+types/login.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const { currentUser, supabase } = c.var
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to') ?? '/library'

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return { error, redirectTo }
    }

    throw c.redirect(redirectTo)
  }

  if (currentUser) {
    throw c.redirect(redirectTo)
  }

  return { error: null, redirectTo }
}

export default function LoginRoute({ loaderData }: Route.ComponentProps) {
  return <LoginPage pageData={loaderData} />
}
