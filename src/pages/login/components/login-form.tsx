'use client'
import { Button } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useActionState } from 'react'
import { getLoginUrl } from '@/controllers/get-login-url.ts'

export function LoginForm({ redirectTo }) {
  const [isRedirecting, toggleIsRedirecting] = useToggle()
  const [, formAction, isRequesting] = useActionState<undefined, FormData>(
    async (state: undefined, payload: FormData) => {
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
    <form action={formAction} className='mx-auto mt-20 text-center'>
      <div className='mt-10'>
        <input name='redirect_to' type='hidden' value={redirectTo} />
        <Button disabled={isLoading} size='4' type='submit' variant='outline'>
          <span className='icon-[logos--google-icon]' />
          {isLoading ? 'Loading...' : 'Login with Google'}
        </Button>
      </div>
    </form>
  )
}
