import { Button, Callout, Card } from '@radix-ui/themes'
import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import { AccountFormField } from '#@/pages/components/account-form-field.tsx'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { SettingsTitle } from '../settings-title.tsx'

const { $patch } = client.auth.password

export function AccountSettings() {
  const { t } = useTranslation()
  const { currentUser } = useGlobalLoaderData()

  function validateFormData(formData: FormData) {
    if (formData.get('new_password') !== formData.get('repeat_new_password')) {
      throw new Error(t('auth.passwordsDoNotMatch'))
    }
    if (formData.get('new_password') === formData.get('password')) {
      throw new Error(t('auth.samePasswordError'))
    }
    return {
      new_password: `${formData.get('new_password')?.toString()}`,
      password: `${formData.get('password')}`,
    }
  }
  const accountFormFields = [
    {
      defaultValue: 'username' in currentUser ? currentUser.username : '',
      iconClass: 'icon-[mdi--user-card-details]',
      label: t('auth.username'),
      name: 'username',
      readOnly: true,
    },
    { iconClass: 'icon-[mdi--password]', label: t('auth.currentPassword'), name: 'password', type: 'password' },
    { iconClass: 'icon-[mdi--password-add]', label: t('auth.newPassword'), name: 'new_password', type: 'password' },
    {
      iconClass: 'icon-[mdi--password-check]',
      label: t('auth.repeatNewPassword'),
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
    async (_key, { arg: event }: { arg: SubmitEvent<HTMLFormElement> }) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const form = validateFormData(formData)
      return await $patch({ form })
    },
  )

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--account]' />
        {t('common.account')}
      </SettingsTitle>
      <Card>
        <form className='flex flex-col gap-2 lg:w-xl' onSubmit={handleSubmit}>
          <div className='grid-cols-2 grid-rows-2 gap-4 lg:grid'>
            {accountFormFields.map((field) => (
              <AccountFormField key={field.name} size='2' {...field} />
            ))}
          </div>
          <div className='pl-2 text-xs opacity-50'>{t('auth.passwordRecommendation')}</div>
          <Button className='mt-2!' loading={isMutating} type='submit'>
            <span className='icon-[mdi--password-check]' />
            {t('auth.updatePassword')}
          </Button>

          {data ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--check]' />
              </Callout.Icon>
              <Callout.Text>{t('auth.passwordUpdated')}</Callout.Text>
            </Callout.Root>
          ) : null}

          {error ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--information]' />
              </Callout.Icon>
              <Callout.Text>{error.message || t('error.unknown')}</Callout.Text>
            </Callout.Root>
          ) : null}
        </form>
      </Card>
    </div>
  )
}
