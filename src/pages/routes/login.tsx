import { getContext } from 'hono/context-storage'
import { defaultRedirectTo } from '@/constants/auth.ts'
import { countUsers } from '@/controllers/users/count-users.ts'
import { LoginPage } from '../login/page.tsx'
import type { Route } from './+types/login.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const { currentUser, supabase, t } = c.var
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
          return { error, formType, redirectTo, title: t('Log in') }
        }
      } catch (error: any) {
        return { error, formType, redirectTo, title: t('Log in') }
      }

      throw c.redirect(redirectTo)
    }

    return { formType, redirectTo, title: t('Log in') }
  }

  const userCount = await countUsers()
  const formType = userCount ? 'login' : 'register'
  return { formType, redirectTo, title: t('Log in') }
}

export default function LoginRoute() {
  return <LoginPage />
}
