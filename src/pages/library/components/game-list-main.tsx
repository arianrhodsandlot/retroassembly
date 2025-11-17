import type { PropsWithChildren } from 'react'
import { GameList } from './game-list/game-list.tsx'
import { PageBreadcrumb } from './page-breadcrumb.tsx'

export function GameListMain({ children }: PropsWithChildren) {
  return (
    <>
      <PageBreadcrumb />
      <div className='flex min-h-full w-full flex-col gap-5 p-4'>
        <div className='relative flex flex-col justify-between pt-4 lg:flex-row lg:px-4'>{children}</div>
        <GameList />
      </div>
    </>
  )
}
