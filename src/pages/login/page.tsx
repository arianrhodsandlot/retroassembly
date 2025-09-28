import { useLoaderData } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import type { loader } from '../routes/login.tsx'
import { LoginForm } from './components/log-in-form.tsx'
import { LogInWithGoogleButton } from './components/log-in-with-google-button.tsx'
import { PageContainer } from './components/page-container.tsx'
import { RegisterForm } from './components/register-form.tsx'

export function LoginPage() {
  const { error, formType, redirectTo } = useLoaderData<typeof loader>()

  if (error) {
    return <PageContainer title='Log in'>{error.message}</PageContainer>
  }

  const title = formType === 'register' ? metadata.title : `Log in to ${metadata.title}`
  const description = {
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
