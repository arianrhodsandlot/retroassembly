import { Button, Callout } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { LoginFormFields } from './log-in-form-fields.tsx'

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { error, isMutating, trigger } = useSWRMutation(
    'auth/login',
    (url, { arg }: { arg: FormData }) => api.post(url, { body: arg }).json(),
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
      await trigger(formData)
    } catch {
      form.querySelector('input')?.select()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4'>
        <LoginFormFields />

        <Button
          className={clsx('transition-opacity', { '!opacity-50 !cursor-default': isMutating || isRedirecting })}
          type='submit'
        >
          <span className='icon-[mdi--account-check] text-xl' />
          Log in
        </Button>

        <AnimatePresence>
          {showError ? (
            <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
              <Callout.Root>
                <Callout.Icon>
                  <span className='icon-[mdi--information]' />
                </Callout.Icon>
                <Callout.Text>{error.message || 'Unknown error'}</Callout.Text>
              </Callout.Root>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <input name='redirect_to' type='hidden' value={redirectTo} />
    </form>
  )
}
