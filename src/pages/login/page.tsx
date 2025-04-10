import { Button } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { Link } from 'react-router'

interface LoginPageProps {
  pageData: {
    error: Error | null
    redirectTo: string
  }
}

export function LoginPage({ pageData }: LoginPageProps) {
  const [clicked, toggleClicked] = useToggle()
  const { error, redirectTo } = pageData

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
