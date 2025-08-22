import { Button, Callout } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { LoginFormFields } from './log-in-form-fields.tsx'

function validateFormData(formData: FormData) {
  if (formData.get('password') !== formData.get('repeat_password')) {
    throw new Error('Passwords do not match')
  }
  return formData
}

export function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { error, isMutating, trigger } = useSWRMutation(
    'auth/register',
    (url, { arg }: { arg: FormData }) => api.post(url, { body: validateFormData(arg) }).json(),
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
