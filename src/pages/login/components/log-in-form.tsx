import { Button, Callout } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, type InferRequestType } from '#@/api/client.ts'
import { LoginFormFields } from './log-in-form-fields.tsx'

const { $post } = client.auth.login

export function LoginForm({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const { t } = useTranslation()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { error, isMutating, trigger } = useSWRMutation(
    { endpoint: 'auth/login', method: 'post' },
    (_key, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) => $post({ form }),
    {
      onSuccess() {
        setIsRedirecting(true)
        location.replace(redirectTo)
      },
    },
  )

  const showError = !isMutating && error

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isMutating) {
      return
    }
    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      await trigger({
        password: formData.get('password')?.toString() || '',
        username: formData.get('username')?.toString() || '',
      })
    } catch {
      form.querySelector('input')?.select()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4'>
        <LoginFormFields />

        <Button
          className={clsx('transition-opacity', { 'opacity-50! cursor-default!': isMutating || isRedirecting })}
          type='submit'
        >
          <span className='icon-[mdi--account-check] text-xl' />
          {t('Log in')}
        </Button>

        <AnimatePresence>
          {showError ? (
            <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
              <Callout.Root>
                <Callout.Icon>
                  <span className='icon-[mdi--information]' />
                </Callout.Icon>
                <Callout.Text>{error.message || t('Unknown error')}</Callout.Text>
              </Callout.Root>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <input name='redirect_to' type='hidden' value={redirectTo} />
    </form>
  )
}
