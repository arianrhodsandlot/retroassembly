import { useTranslation } from 'react-i18next'
import { AccountFormField } from '#@/pages/components/account-form-field.tsx'

export function LoginFormFields({ register = false }: Readonly<{ register?: boolean }>) {
  const { t } = useTranslation()

  return (
    <>
      <AccountFormField
        autoFocus
        description={register ? t('auth.usernameExamples') : ''}
        iconClass='icon-[mdi--user-card-details]'
        label={t('auth.username')}
        name='username'
      />

      <AccountFormField
        description={register ? t('auth.passwordRecommendation') : ''}
        iconClass='icon-[mdi--password]'
        label={t('auth.password')}
        name='password'
        type='password'
      />

      {register ? (
        <AccountFormField
          iconClass='icon-[mdi--password-check]'
          label={t('auth.repeatPassword')}
          name='repeat_password'
          type='password'
        />
      ) : null}
    </>
  )
}
