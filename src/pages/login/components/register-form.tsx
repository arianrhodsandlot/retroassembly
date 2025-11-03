import { Button, Callout } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, type InferRequestType } from '@/api/client.ts'
import { LoginFormFields } from './log-in-form-fields.tsx'

const { $post } = client.auth.register

export function RegisterForm({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const { t } = useTranslation()
  const [isRedirecting, setIsRedirecting] = useState(false)

  function validateFormData(formData: FormData) {
    if (formData.get('password') !== formData.get('repeat_password')) {
      throw new Error(t('Passwords do not match'))
    }
    return {
      password: formData.get('password')?.toString() || '',
      username: formData.get('username')?.toString() || '',
    }
  }

  const { error, isMutating, trigger } = useSWRMutation(
    { endpoint: 'auth/register', method: 'post' },
    (_key, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) => $post({ form }),
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
      await trigger(validateFormData(formData))
    } catch {}
  }

  return (
    <form method='post' onSubmit={handleSubmit}>
      <input name='redirect_to' type='hidden' value={redirectTo} />
      <div className='flex flex-col gap-4'>
        <LoginFormFields register />
        <Button
          className={clsx('transition-opacity', { 'opacity-50! cursor-default!': isMutating || isRedirecting })}
          type='submit'
        >
          <span className='icon-[mdi--register]' />
          {t('Create your account')}
        </Button>
      </div>

      {error ? (
        <Callout.Root className='mt-4'>
          <Callout.Icon>
            <span className='icon-[mdi--information]' />
          </Callout.Icon>
          <Callout.Text>{error.message || t('Unknown error')}</Callout.Text>
        </Callout.Root>
      ) : null}
    </form>
  )
}
