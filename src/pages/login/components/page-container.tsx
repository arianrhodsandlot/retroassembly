import type { PropsWithChildren } from 'react'
import { Link } from 'react-router'
import { metadata } from '@/constants/metadata.ts'

interface PageContainerProps extends PropsWithChildren {
  description?: string
  title: string
}

export function PageContainer({ children, description, title }: PageContainerProps) {
  return (
    <>
      <title>{`Log in - ${metadata.title}`}</title>
      <div className='bg-(--accent-9) min-h-dvh px-4 py-20'>
        <div className='md:w-3xl mx-auto w-full max-w-full rounded bg-white p-10'>
          <div className='flex items-center justify-center gap-4'>
            <Link className='flex items-center justify-center' reloadDocument to='/'>
              <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
            </Link>
            <h1 className='text-3xl font-semibold'>{title}</h1>
          </div>

          {description ? <div className='mt-4 text-center text-black/40'>{description}</div> : null}

          <div className='mt-4 border-t border-t-black/20 py-8'>{children}</div>

          <div className='hidden text-xs text-black/40'>
            By clicking the button, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </>
  )
}
