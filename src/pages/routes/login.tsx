import { getContext } from 'hono/context-storage'
import { defaultRedirectTo } from '@/constants/auth.ts'
import { countUsers } from '@/controllers/count-users.ts'
import { LoginPage } from '../login/page.tsx'
import type { Route } from './+types/login.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const { currentUser, supabase } = c.var
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect_to') ?? defaultRedirectTo

  if (currentUser) {
    throw c.redirect(redirectTo)
  }

  if (supabase) {
    const formType = 'oauth'
    const code = searchParams.get('code')
    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          return { error, formType, redirectTo }
        }
      } catch (error) {
        return { error, formType, redirectTo }
      }

      throw c.redirect(redirectTo)
    }

    return { formType, redirectTo }
  }

  const userCount = await countUsers()
  const formType = userCount ? 'login' : 'register'
  return { formType, redirectTo }
}

export default function LoginRoute({ loaderData }: Route.ComponentProps) {
  return <LoginPage pageData={loaderData} />
}
