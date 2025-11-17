import type { PropsWithChildren } from 'react'

export function LayoutMain({ children }: PropsWithChildren) {
  return (
    <main className={'border-(--accent-9) relative flex-1 border-x-8 transition-colors duration-500 lg:ml-72 lg:mt-4'}>
      {children}

      <div className='*:bg-(--accent-9) *:left-71 *:fixed *:hidden *:size-2 *:rounded *:[corner-shape:scoop] *:lg:block'>
        <div className='top-3' />
        <div className='bottom-11' />
      </div>
    </main>
  )
}
