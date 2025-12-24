import { Button, Callout, Dialog } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import { AccountFormField } from '#@/pages/components/account-form-field.tsx'

interface CreateUserDialogProps {
  onOpenChange: (open: boolean) => void
  onSuccess: (newUserId?: string) => void
  open: boolean
}

export function CreateUserDialog({ onOpenChange, onSuccess, open }: Readonly<CreateUserDialogProps>) {
  const { t } = useTranslation()
  const [error, setError] = useState<null | string>(null)

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'users', method: 'post' },
    async (_key, { arg }: { arg: { password: string; username: string } }) => {
      setError(null)
      return await parseResponse(
        client.users.$post({
          form: { password: arg.password, username: arg.username },
        }),
      )
    },
    {
      onError: (err) => {
        setError(err.message || t('Unknown error'))
      },
      onSuccess: (result) => {
        onSuccess(result?.id)
        onOpenChange(false)
      },
    },
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')?.toString() || ''
    const password = formData.get('password')?.toString() || ''

    if (formData.get('password') !== formData.get('repeat_password')) {
      setError(t('Passwords do not match'))
      return
    }

    await trigger({ password, username })
  }

  function handleOpenChange(open: boolean) {
    if (!isMutating) {
      setError(null)
      onOpenChange(open)
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Content>
        <Dialog.Title>
          <div className='flex items-center'>
            <span className='icon-[mdi--account-plus] mr-2' />
            {t('Create New User')}
          </div>
        </Dialog.Title>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='my-4 flex flex-col gap-4'>
            <AccountFormField
              iconClass='icon-[mdi--user-card-details]'
              label={t('Username')}
              name='username'
              required
            />
            <AccountFormField
              description={t('Recommendation: 10+ characters with letters, numbers, and symbols.')}
              iconClass='icon-[mdi--password]'
              label={t('Password')}
              name='password'
              required
              type='password'
            />
            <AccountFormField
              iconClass='icon-[mdi--password-check]'
              label={t('Repeat password')}
              name='repeat_password'
              required
              type='password'
            />
          </div>
          {error ? (
            <Callout.Root className='mb-4' color='red'>
              <Callout.Icon>
                <span className='icon-[mdi--information]' />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          ) : null}
          <div className='flex justify-end gap-3'>
            <Dialog.Close>
              <Button disabled={isMutating} variant='soft'>
                <span className='icon-[mdi--close]' />
                {t('Cancel')}
              </Button>
            </Dialog.Close>
            <Button loading={isMutating} type='submit'>
              <span className='icon-[mdi--account-plus]' />
              {t('Create User')}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
