import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

export function LayoutMain({ children }: Readonly<PropsWithChildren>) {
  return (
    <main
      className={clsx(
        'relative flex-1 overflow-hidden border-r-[calc(0.5rem+env(safe-area-inset-right))] border-b-[calc(0.5rem+env(safe-area-inset-bottom))] border-l-[calc(0.5rem+env(safe-area-inset-left))] border-(--accent-9)',
        'lg:mt-4 lg:mr-4 lg:mb-0 lg:ml-72 lg:border-none lg:pb-12',
      )}
    >
      {children}

      <div className='text-(--accent-9) *:absolute *:size-1 lg:block *:lg:fixed'>
        <div className='top-0 left-0 lg:top-4 lg:left-72'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M4 0C1.79086 0 0 1.79086 0 4V0H4Z' fill='currentColor' />
          </svg>
        </div>

        <div className='top-0 right-0 lg:top-4 lg:right-4'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M4 4C4 1.79086 2.20914 0 0 0L4 0V4Z' fill='currentColor' />
          </svg>
        </div>

        <div className='top-full left-0 -translate-y-1 lg:left-72 lg:-translate-y-13'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M0 0C0 2.20914 1.79086 4 4 4L0 4L0 0Z' fill='currentColor' />
          </svg>
        </div>

        <div className='top-full right-0 -translate-y-1 lg:right-4 lg:-translate-y-13'>
          <svg height='4' viewBox='0 0 4 4' width='4'>
            <path d='M0 4C2.20914 4 4 2.20914 4 0L4 4L0 4Z' fill='currentColor' />
          </svg>
        </div>
      </div>
    </main>
  )
}
