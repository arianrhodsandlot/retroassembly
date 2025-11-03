import { useTranslation } from 'react-i18next'
import { AccountFormField } from '@/pages/components/account-form-field.tsx'

export function LoginFormFields({ register = false }: Readonly<{ register?: boolean }>) {
  const { t } = useTranslation()

  return (
    <>
      <AccountFormField
        autoFocus
        description={register ? t('Username examples') : ''}
        iconClass='icon-[mdi--user-card-details]'
        label={t('Username')}
        name='username'
      />

      <AccountFormField
        description={register ? t('Recommendation: 10+ characters with letters, numbers, and symbols.') : ''}
        iconClass='icon-[mdi--password]'
        label={t('Password')}
        name='password'
        type='password'
      />

      {register ? (
        <AccountFormField
          iconClass='icon-[mdi--password-check]'
          label={t('Repeat password')}
          name='repeat_password'
          type='password'
        />
      ) : null}
    </>
  )
}
