import type { PropsWithChildren } from 'react'
import { Link, useLoaderData } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import type { loader } from '../../routes/login.tsx'

interface PageContainerProps extends PropsWithChildren {
  description?: string
  title: string
}

export function PageContainer({ children, description, title }: Readonly<PageContainerProps>) {
  const { formType } = useLoaderData<typeof loader>()

  return (
    <>
      <title>{`Log in - ${metadata.title}`}</title>
      <div className='bg-(--accent-9) min-h-dvh px-4 py-20'>
        <div className='md:w-3xl bg-(--color-background) mx-auto w-full max-w-full rounded p-10'>
          <div className='flex items-center justify-center gap-4'>
            <Link className='flex items-center justify-center' reloadDocument to='/'>
              <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
            </Link>
            <h1 className='text-3xl font-semibold'>{title}</h1>
          </div>

          {description ? <div className='text-(--color-text)/40 mt-4 text-center'>{description}</div> : null}

          <div className='border-t-(--gray-6) mt-4 border-t py-8'>{children}</div>

          {formType === 'oauth' ? (
            <div className='text-(--color-text)/40 text-center text-xs'>
              By clicking the button, you agree to our{' '}
              <a className='underline' href='/privacy-policy.md' rel='noopener noreferrer' target='_blank'>
                Privacy Policy
              </a>
              .
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
