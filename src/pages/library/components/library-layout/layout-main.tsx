import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

export function LayoutMain({ children }: PropsWithChildren) {
  return (
    <main
      className={clsx(
        'border-(--accent-9) relative flex-1 overflow-hidden border-x-8 border-b-[length:env(safe-area-inset-bottom)]',
        'lg:mb-0 lg:ml-72 lg:mr-4 lg:mt-4 lg:border-none lg:pb-12',
      )}
    >
      {children}

      <div className='text-(--accent-9) *:absolute *:size-1 lg:block *:lg:fixed'>
        <div className='left-0 top-0 lg:left-72 lg:top-4'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M4 0C1.79086 0 0 1.79086 0 4V0H4Z' fill='currentColor' />
          </svg>
        </div>

        <div className='right-0 top-0 lg:right-4 lg:top-4'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M4 4C4 1.79086 2.20914 0 0 0L4 0V4Z' fill='currentColor' />
          </svg>
        </div>

        <div className='lg:-translate-y-13 left-0 top-full -translate-y-1 lg:left-72'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M0 0C0 2.20914 1.79086 4 4 4L0 4L0 0Z' fill='currentColor' />
          </svg>
        </div>

        <div className='lg:-translate-y-13 right-0 top-full -translate-y-1 lg:right-4'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M0 4C2.20914 4 4 2.20914 4 0L4 4L0 4Z' fill='currentColor' />
          </svg>
        </div>
      </div>
    </main>
  )
}
