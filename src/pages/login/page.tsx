import { getContext } from 'hono/context-storage'
import type { Route } from './+types/page.ts'
import { LoginForm } from './components/login-form.tsx'

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

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const { error, redirectTo } = loaderData

  if (error) {
    return <div>{error.message}</div>
  }

  if (redirectTo) {
    return (
      <>
        <title>Login - RetroAssembly</title>
        <LoginForm redirectTo={redirectTo} />
      </>
    )
  }
}
