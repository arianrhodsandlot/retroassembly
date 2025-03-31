import { getContextData } from 'waku/middleware/context'
import { LoginForm } from './components/login-form.tsx'

export async function LoginPage({ query }) {
  const searchParams = new URLSearchParams(query)
  const redirectTo = searchParams.get('redirect_to') ?? '/library'
  const code = searchParams.get('code')
  const { redirect, supabase } = getContextData()

  if (!supabase) {
    redirect('/')
    return
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return <div>{error.message}</div>
    }
    if (data) {
      redirect(redirectTo)
      return
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
