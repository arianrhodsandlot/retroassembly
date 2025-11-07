import type { PropsWithChildren } from 'react'

export function LayoutMain({ children }: PropsWithChildren) {
  return (
    <main className={'relative mt-4 flex-1 transition-colors duration-500 lg:ml-72'}>
      {children}

      <div className='*:bg-(--accent-9) *:before:bg-(--color-background) size-0 *:hidden *:size-1 *:before:absolute *:before:size-2 *:before:rounded-full *:before:transition-colors  *:before:duration-500 *:lg:fixed *:lg:block'>
        <div className='left-72 right-4 top-4' />
        <div className='bottom-12 left-72 before:bottom-0' />
      </div>
    </main>
  )
}
