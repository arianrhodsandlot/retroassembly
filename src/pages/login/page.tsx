import { Button } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { getContext } from 'hono/context-storage'
import { Link } from 'react-router'
import type { Route } from './+types/page.ts'

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
  const [clicked, toggleClicked] = useToggle()
  const { error, redirectTo } = loaderData

  function handleClick() {
    toggleClicked()
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (redirectTo) {
    return (
      <>
        <title>Login - RetroAssembly</title>
        <div className='min-h-screen bg-[var(--accent-9)] py-20'>
          <form className='w-3xl mx-auto rounded bg-white p-10 text-center'>
            <div className='flex items-center justify-center gap-4'>
              <Link className='flex items-center justify-center' reloadDocument to='/'>
                <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
              </Link>
              <h1 className='text-3xl font-semibold'>Sign in</h1>
            </div>

            <div className='mt-4 text-black/40'>Sign in to build your own retro game collection cabinet</div>

            <div className='mt-4 border-t border-t-black/20 py-8'>
              <input name='redirect_to' type='hidden' value={redirectTo} />
              <Button asChild disabled={clicked} onClick={handleClick} size='3' type='submit' variant='soft'>
                <Link
                  className='flex items-center gap-2'
                  to={{
                    pathname: '/login/google',
                    search: `?redirect_to=${encodeURIComponent(redirectTo)}`,
                  }}
                >
                  <span className='icon-[logos--google-icon]' />
                  Login with Google
                </Link>
              </Button>
            </div>

            <div className='text-xs text-black/40'>
              By clicking the button, you agree to our Terms of Service and Privacy Policy.
            </div>
          </form>
        </div>
      </>
    )
  }
}
