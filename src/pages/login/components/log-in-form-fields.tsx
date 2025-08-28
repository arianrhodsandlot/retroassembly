import { AccountFormField } from '@/pages/components/account-form-field.tsx'

export function LoginFormFields({ register = false }: Readonly<{ register?: boolean }>) {
  return (
    <>
      <AccountFormField
        autoFocus
        description={register ? 'E.g., johnsmith, admin' : ''}
        iconClass='icon-[mdi--user-card-details]'
        label='Username'
        name='username'
      />

      <AccountFormField
        description={register ? 'Recommendation: 10+ characters with letters, numbers, and symbols.' : ''}
        iconClass='icon-[mdi--password]'
        label='Password'
        name='password'
        type='password'
      />

      {register ? (
        <AccountFormField
          iconClass='icon-[mdi--password-check]'
          label='Repeat password'
          name='repeat_password'
          type='password'
        />
      ) : null}
    </>
  )
}
