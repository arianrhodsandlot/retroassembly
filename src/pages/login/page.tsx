import { LoginForm } from './components/log-in-form.tsx'
import { LogInWithGoogleButton } from './components/log-in-with-google-button.tsx'
import { PageContainer } from './components/page-container.tsx'
import { RegisterForm } from './components/register-form.tsx'

interface LoginPageProps {
  pageData: {
    error?: Error
    formType: string
    redirectTo: string
  }
}

export function LoginPage({ pageData }: LoginPageProps) {
  const { error, formType, redirectTo } = pageData

  if (error) {
    return <PageContainer title='Log in'>{error.message}</PageContainer>
  }

  const title = formType === 'register' ? 'RetroAssembly' : 'Log in to RetroAssembly'
  const description = {
    login: 'Log in to your account to continue',
    oauth: 'Log in to build your own retro game collection',
    register: 'Create an account to get started',
  }[formType]
  return (
    <PageContainer description={description} title={title}>
      {formType === 'register' ? <RegisterForm redirectTo={redirectTo} /> : null}
      {formType === 'login' ? <LoginForm redirectTo={redirectTo} /> : null}
      {formType === 'oauth' ? <LogInWithGoogleButton redirectTo={redirectTo} /> : null}
    </PageContainer>
  )
}
