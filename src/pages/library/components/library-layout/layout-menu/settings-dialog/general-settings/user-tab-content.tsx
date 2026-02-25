import { Button, Callout, Flex, Text } from '@radix-ui/themes'
import { useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import { AccountFormField } from '#@/pages/components/account-form-field.tsx'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'

const { $patch } = client.auth.password

interface UserTabContentProps {
  canDelete: boolean
  onDelete?: () => void
  user: {
    id: string
  }
}

export function UserTabContent({ canDelete, onDelete, user }: Readonly<UserTabContentProps>) {
  const { t } = useTranslation()
  const { currentUser } = useGlobalLoaderData()
  const [passwordError, setPasswordError] = useState<null | string>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const isCurrentUser = user.id === currentUser.id

  const { isMutating: isUpdatingPassword, trigger: handleSubmit } = useSWRMutation(
    { endpoint: 'auth/password', method: 'patch' },
    async (_key, { arg: event }: { arg: SubmitEvent<HTMLFormElement> }) => {
      event.preventDefault()
      setPasswordError(null)
      setPasswordSuccess(false)

      const formData = new FormData(event.currentTarget)

      if (formData.get('new_password') !== formData.get('repeat_new_password')) {
        setPasswordError(t('Passwords do not match'))
        return
      }

      if (formData.get('new_password') === formData.get('password')) {
        setPasswordError(t('The new password is the same as the current password'))
        return
      }

      const form = {
        new_password: `${formData.get('new_password')?.toString()}`,
        password: `${formData.get('password')?.toString()}`,
      }

      const formElement = event.currentTarget
      const result = await $patch({ form })
      setPasswordSuccess(true)
      formElement.reset()
      return result
    },
    {
      onError: (err) => {
        setPasswordError(err.message || t('Unknown error'))
      },
    },
  )

  return (
    <Flex className={isCurrentUser ? '' : 'py-4'} direction='column' gap='4'>
      {canDelete ? (
        <div className='mt-2! lg:w-xl'>
          <Button
            className='w-full!'
            color='red'
            disabled={isCurrentUser}
            onClick={onDelete}
            type='button'
            variant='soft'
          >
            <span className='icon-[mdi--delete]' />
            {t('Delete User')}
          </Button>
        </div>
      ) : null}

      {/* Password change section - only for current user */}
      {isCurrentUser ? (
        <>
          <Flex align='center' className='pt-4' gap='2'>
            <span className='icon-[mdi--lock-reset]' />
            <Text size='3' weight='bold'>
              {t('Change Password')}
            </Text>
          </Flex>

          <form className='flex flex-col gap-2 lg:w-xl' onSubmit={handleSubmit}>
            <div className='grid-cols-2 grid-rows-2 gap-4 lg:grid'>
              <AccountFormField
                autoComplete='current-password'
                iconClass='icon-[mdi--password]'
                label={t('Current Password')}
                name='password'
                required
                size='2'
                type='password'
              />
              <AccountFormField
                iconClass='icon-[mdi--password-add]'
                label={t('New Password')}
                name='new_password'
                required
                size='2'
                type='password'
              />
              <AccountFormField
                iconClass='icon-[mdi--password-check]'
                label={t('Repeat New Password')}
                name='repeat_new_password'
                required
                size='2'
                type='password'
              />
            </div>
            <div className='pl-2 text-xs opacity-50'>
              {t('Recommendation: 10+ characters with letters, numbers, and symbols.')}
            </div>
            <Button className='mt-2!' loading={isUpdatingPassword} type='submit'>
              <span className='icon-[mdi--password-check]' />
              {t('Update Password')}
            </Button>

            {passwordSuccess ? (
              <Callout.Root className='mt-4'>
                <Callout.Icon>
                  <span className='icon-[mdi--check]' />
                </Callout.Icon>
                <Callout.Text>{t('Your password has been updated')}</Callout.Text>
              </Callout.Root>
            ) : null}

            {passwordError ? (
              <Callout.Root className='mt-4' color='red'>
                <Callout.Icon>
                  <span className='icon-[mdi--information]' />
                </Callout.Icon>
                <Callout.Text>{passwordError}</Callout.Text>
              </Callout.Root>
            ) : null}
          </form>
        </>
      ) : null}
    </Flex>
  )
}
