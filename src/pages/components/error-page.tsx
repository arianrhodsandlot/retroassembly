import { Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, Link } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'
import type { Route } from '../+types/root.ts'

export function ErrorPage({ error }: Readonly<Route.ErrorBoundaryProps>) {
  const { t } = useTranslation()

  let message = t('Oops!')
  let details = t('An unexpected error occurred.')
  let stack = ''
  let status = t('Unexpected error')

  if (isRouteErrorResponse(error)) {
    status = `${error.status}`
    message = error.status === 404 ? t('404') : t('Error')
    details = error.status === 404 ? t('The requested page could not be found.') : error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
    if (error.stack) {
      stack = error.stack
    }
  }

  return (
    <>
      <title>{`${status} - ${metadata.title}`}</title>
      <div className='min-h-dvh bg-(--accent-9) py-20'>
        <main className='mx-8 flex max-w-full flex-col rounded bg-(--color-background) p-10 md:mx-auto md:w-3xl'>
          <h1 className='mt-4 flex items-center gap-2 text-4xl font-semibold'>
            <span className='icon-[mdi--robot-confused]' /> {message}
          </h1>
          <p className='py-4 text-lg'>{details}</p>
          {stack && (
            <pre className='mb-4 w-full overflow-x-auto rounded bg-neutral-900 p-4 text-xs text-neutral-100'>
              <code>{stack}</code>
            </pre>
          )}
          <div className='flex justify-center gap-4'>
            <Button asChild radius='small' size='2' type='button'>
              <Link reloadDocument to='/'>
                <span className='icon-[mdi--home]' />
                {t('Home')}
              </Link>
            </Button>

            <Button asChild radius='small' size='2' type='button' variant='outline'>
              <Link
                className='border-2! bg-(--color-background)! shadow-none! in-[.dark]:border-(--gray-4)!'
                reloadDocument
                to='/library'
              >
                <span className='icon-[mdi--bookshelf]' />
                {t('Library')}
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}
