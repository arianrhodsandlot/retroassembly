import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'
import type { loader } from '../../routes/login.tsx'

interface PageContainerProps extends PropsWithChildren {
  description?: string
  title: string
}

export function PageContainer({ children, description, title }: Readonly<PageContainerProps>) {
  const { t } = useTranslation()
  const { formType } = useLoaderData<typeof loader>()

  return (
    <>
      <title>{t('Log in to {{title}}', { title: metadata.title })}</title>
      <div className='min-h-dvh bg-(--accent-9) px-4 py-20'>
        <div className='mx-auto w-full max-w-full rounded bg-(--color-background) p-10 md:w-3xl'>
          <div className='flex items-center justify-center gap-4'>
            <Link className='flex items-center justify-center' reloadDocument to='/'>
              <img alt='logo' height='32' src='/assets/logo/logo.svg' width='32' />
            </Link>
            <h1 className='text-3xl font-semibold'>{title}</h1>
          </div>

          {description ? <div className='mt-4 text-center text-(--color-text)/40'>{description}</div> : null}

          <div className='mt-4 border-t border-t-(--gray-6) py-8'>{children}</div>

          {formType === 'oauth' ? (
            <div className='text-center text-xs text-(--color-text)/40'>
              {t('By clicking the button, you agree to our')}{' '}
              <a className='underline' href='/privacy-policy.md' rel='noopener noreferrer' target='_blank'>
                {t('Privacy Policy')}
              </a>
              .
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
