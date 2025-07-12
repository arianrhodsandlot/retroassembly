import { LoginFormField } from './log-in-form-field.tsx'

export function LoginFormFields({ register = false }: { register?: boolean }) {
  return (
    <>
      <LoginFormField
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        description={register ? 'E.g., johnsmith, admin, etc.' : ''}
        iconClass='icon-[mdi--user-card-details]'
        label='Username'
        name='username'
      />

      <LoginFormField
        description={register ? 'Recommendation: 10+ characters with letters, numbers, and symbols.' : ''}
        iconClass='icon-[mdi--password]'
        label='Password'
        name='password'
        type='password'
      />

      {register ? (
        <LoginFormField
          iconClass='icon-[mdi--password-check]'
          label='Repeat password'
          name='repeat_password'
          type='password'
        />
      ) : null}
    </>
  )
}
