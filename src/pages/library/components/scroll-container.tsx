'use client'
import { clsx } from 'clsx'
import { ScrollArea } from 'radix-ui'
import type { ReactNode } from 'react'

export function ScrollContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ScrollArea.Root className={clsx('overflow-hidden', className)} scrollHideDelay={0}>
      <ScrollArea.Viewport className='size-full'>{children}</ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        className='flex w-3 touch-none select-none p-0.5 transition-all ease-out hover:bg-black/10'
        orientation='vertical'
      >
        <ScrollArea.Thumb className='relative flex-1 rounded-lg bg-black' />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar
        className='flex h-3 touch-none select-none flex-col p-0.5 transition-all ease-out hover:bg-black/10 data-[state=hidden]:duration-1000'
        orientation='horizontal'
      >
        <ScrollArea.Thumb className='relative flex-1 rounded-lg bg-black' />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
