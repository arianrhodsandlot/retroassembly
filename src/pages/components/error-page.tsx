import { Button } from '@radix-ui/themes'
import { isRouteErrorResponse, Link } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import type { Route } from '../+types/root.ts'

export function ErrorPage({ error }: Readonly<Route.ErrorBoundaryProps>) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack = ''
  let status = 'Unexpected error'

  if (isRouteErrorResponse(error)) {
    status = `${error.status}`
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
    if (error.stack) {
      stack = error.stack
    }
  }

  return (
    <>
      <title>{`${status} - ${metadata.title}`}</title>
      <div className='bg-(--accent-9) min-h-dvh py-20'>
        <main className='md:w-3xl bg-(--color-background) mx-8 flex max-w-full flex-col rounded p-10 md:mx-auto'>
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
                Home
              </Link>
            </Button>

            <Button asChild radius='small' size='2' type='button' variant='outline'>
              <Link
                className='!bg-(--color-background) [.dark_&]:!border-(--gray-4) !border-2 !shadow-none'
                reloadDocument
                to='/library'
              >
                <span className='icon-[mdi--bookshelf]' />
                Library
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}
