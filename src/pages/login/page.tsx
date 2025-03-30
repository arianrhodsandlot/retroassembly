import { getContextData } from 'waku/middleware/context'
import { unstable_redirect } from 'waku/router/server'
import { LoginForm } from './components/login-form.tsx'

export async function LoginPage({ query }) {
  const searchParams = new URLSearchParams(query)
  const redirectTo = searchParams.get('redirect_to') ?? '/library'
  const code = searchParams.get('code')
  const { supabase } = getContextData()

  if (!supabase) {
    unstable_redirect('/')
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return <div>{error.message}</div>
    }
    if (data) {
      unstable_redirect(redirectTo)
    }
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
