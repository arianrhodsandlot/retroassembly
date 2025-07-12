import { Button, Callout } from '@radix-ui/themes'
import clsx from 'clsx'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { LoginFormFields } from './log-in-form-fields.tsx'

export function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { error, isMutating, trigger } = useSWRMutation(
    'auth/register',
    async (url, { arg }: { arg: FormData }) => {
      if (arg.get('password') !== arg.get('repeat_password')) {
        throw new Error('Passwords do not match')
      }
      await api.post(url, { body: arg }).json()
    },
    {
      onSuccess() {
        setIsRedirecting(true)
        location.replace(redirectTo)
      },
    },
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      await trigger(formData)
    } catch {}
  }

  return (
    <form method='post' onSubmit={handleSubmit}>
      <input name='redirect_to' type='hidden' value={redirectTo} />
      <div className='flex flex-col gap-4'>
        <LoginFormFields register />
        <Button
          className={clsx('transition-opacity', { '!opacity-50 !cursor-default': isMutating || isRedirecting })}
          type='submit'
        >
          <span className='icon-[mdi--register]' />
          Create your account
        </Button>
      </div>

      {error ? (
        <Callout.Root className='mt-4'>
          <Callout.Icon>
            <span className='icon-[mdi--information]' />
          </Callout.Icon>
          <Callout.Text>{error.message || 'Unknown error'}</Callout.Text>
        </Callout.Root>
      ) : null}
    </form>
  )
}
