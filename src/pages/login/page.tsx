import { serialize } from 'cookie'
import { getContext } from 'hono/context-storage'
import { redirectDocument } from 'react-router'
import { serializeCookieHeader } from '@/utils/misc.ts'
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

    const headers = new Headers()
    const cookiesToSet = c.get('cookiesToSet') || []
    for (const { name, options, value } of cookiesToSet) {
      const serialized = serialize(name, value, options)
      const serialized2 = serializeCookieHeader(name, value, options)
      console.log(serialized, serialized2, serialized === serialized2)
      headers.append('Set-Cookie', serialized2)
    }
    throw redirectDocument(redirectTo, { headers })
  }

  if (currentUser) {
    throw redirectDocument(redirectTo)
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
