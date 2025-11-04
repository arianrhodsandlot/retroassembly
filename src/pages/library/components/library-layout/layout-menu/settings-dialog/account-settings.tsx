import { Button, Callout, Card } from '@radix-ui/themes'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { AccountFormField } from '@/pages/components/account-form-field.tsx'
import { SettingsTitle } from './settings-title.tsx'

const { $patch } = client.auth.password

export function AccountSettings() {
  const { t } = useTranslation()
  const { currentUser } = useLoaderData()

  function validateFormData(formData: FormData) {
    if (formData.get('new_password') !== formData.get('repeat_new_password')) {
      throw new Error(t('Passwords do not match'))
    }
    if (formData.get('new_password') === formData.get('password')) {
      throw new Error(t('The new password is the same as the current password'))
    }
    return {
      new_password: `${formData.get('new_password')}`,
      password: `${formData.get('password')}`,
    }
  }
  const accountFormFields = [
    {
      defaultValue: currentUser.username,
      iconClass: 'icon-[mdi--user-card-details]',
      label: t('Username'),
      name: 'username',
      readOnly: true,
    },
    { iconClass: 'icon-[mdi--password]', label: t('Current Password'), name: 'password', type: 'password' },
    { iconClass: 'icon-[mdi--password-add]', label: t('New Password'), name: 'new_password', type: 'password' },
    {
      iconClass: 'icon-[mdi--password-check]',
      label: t('Repeat New Password'),
      name: 'repeat_new_password',
      type: 'password',
    },
  ] as const

  const {
    data,
    error,
    isMutating,
    trigger: handleSubmit,
  } = useSWRMutation(
    { endpoint: 'auth/password', method: 'patch' },
    async (_key, { arg: event }: { arg: FormEvent<HTMLFormElement> }) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const form = validateFormData(formData)
      return await $patch({ form })
    },
  )

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--password]' />
        {t('Password')}
      </SettingsTitle>
      <Card>
        <form className='lg:w-xl flex flex-col gap-2' onSubmit={handleSubmit}>
          <div className='grid-cols-2 grid-rows-2 gap-4 lg:grid'>
            {accountFormFields.map((field) => (
              <AccountFormField key={field.name} size='2' {...field} />
            ))}
          </div>
          <div className='pl-2 text-xs opacity-50'>
            {t('Recommendation: 10+ characters with letters, numbers, and symbols.')}
          </div>
          <Button className='mt-2!' loading={isMutating} type='submit'>
            <span className='icon-[mdi--password-check]' />
            {t('Update Password')}
          </Button>

          {data ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--check]' />
              </Callout.Icon>
              <Callout.Text>{t('Your password has been updated')}</Callout.Text>
            </Callout.Root>
          ) : null}

          {error ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--information]' />
              </Callout.Icon>
              <Callout.Text>{error.message || t('Unknown error')}</Callout.Text>
            </Callout.Root>
          ) : null}
        </form>
      </Card>
    </div>
  )
}
