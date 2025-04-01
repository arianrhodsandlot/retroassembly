'use client'
import { Button } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useActionState } from 'react'
import { getLoginUrl } from '@/controllers/get-login-url.ts'

export function LoginForm({ redirectTo }) {
  const [isRedirecting, toggleIsRedirecting] = useToggle()
  const [, formAction, isRequesting] = useActionState<undefined, FormData>(
    async (_state: undefined, payload: FormData) => {
      const loginUrl = await getLoginUrl(payload)
      if (loginUrl) {
        toggleIsRedirecting()
        location.assign(loginUrl)
      }
    },
    undefined,
  )

  const isLoading = isRequesting || isRedirecting

  return (
    <div className='min-h-screen bg-[var(--accent-9)] py-20'>
      <form action={formAction} className='w-3xl mx-auto rounded bg-white p-10 text-center'>
        <h1 className='text-3xl font-semibold'>Sign in</h1>

        <div className='mt-4 text-black/40'>Log in to build your own retro game cabinet</div>

        <div className='mt-4 border-t border-t-black/20 py-8'>
          <input name='redirect_to' type='hidden' value={redirectTo} />
          <Button disabled={isLoading} size='3' type='submit' variant='soft'>
            <span className='icon-[logos--google-icon]' />
            Login with Google
          </Button>
        </div>

        <div className='text-xs text-black/40'>
          By clicking the button, you agree to our Terms of Service and Privacy Policy.
        </div>
      </form>
    </div>
  )
}
