import { Button, Callout, Card } from '@radix-ui/themes'
import { attemptAsync } from 'es-toolkit'
import { useLoaderData } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { AccountFormField } from '@/pages/components/account-form-field.tsx'
import { api } from '@/utils/http.ts'
import { SettingsTitle } from './settings-title.tsx'

function validateFormData(formData: FormData) {
  if (formData.get('new_password') !== formData.get('repeat_new_password')) {
    throw new Error('Passwords do not match')
  }
  if (formData.get('new_password') === formData.get('password')) {
    throw new Error('The new password is the same as the current password')
  }
  return formData
}

export function AccountSettings() {
  const { currentUser } = useLoaderData()
  const accountFormFields = [
    {
      defaultValue: currentUser.username,
      iconClass: 'icon-[mdi--user-card-details]',
      label: 'Username',
      name: 'username',
      readOnly: true,
    },
    { iconClass: 'icon-[mdi--password]', label: 'Current Password', name: 'password', type: 'password' },
    { iconClass: 'icon-[mdi--password-add]', label: 'New Password', name: 'new_password', type: 'password' },
    {
      iconClass: 'icon-[mdi--password-check]',
      label: 'Repeat New Password',
      name: 'repeat_new_password',
      type: 'password',
    },
  ] as const

  const { data, error, isMutating, reset, trigger } = useSWRMutation(
    'auth/password',
    (url, { arg }: { arg: FormData }) => api.patch(url, { body: validateFormData(arg) }).json(),
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    reset()
    const [error] = await attemptAsync(() => trigger(formData))
    if (!error) {
      form.reset()
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--password]' />
        Password
      </SettingsTitle>
      <Card>
        <form className='lg:w-xl flex flex-col gap-2' onSubmit={handleSubmit}>
          <div className='grid-cols-2 grid-rows-2 gap-4 lg:grid'>
            {accountFormFields.map((field) => (
              <AccountFormField key={field.name} size='2' {...field} />
            ))}
          </div>
          <div className='pl-2 text-xs opacity-50'>
            Recommendation: 10+ characters with letters, numbers, and symbols.
          </div>
          <Button className='!mt-2' loading={isMutating} type='submit'>
            <span className='icon-[mdi--password-check]' />
            Update Password
          </Button>

          {data ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--check]' />
              </Callout.Icon>
              <Callout.Text>Your password has been updated</Callout.Text>
            </Callout.Root>
          ) : null}

          {error ? (
            <Callout.Root className='mt-4'>
              <Callout.Icon>
                <span className='icon-[mdi--information]' />
              </Callout.Icon>
              <Callout.Text>{error.message || 'Unknown error'}</Callout.Text>
            </Callout.Root>
          ) : null}
        </form>
      </Card>
    </div>
  )
}
