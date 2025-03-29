import type { ReactNode } from 'react'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { FocusIndicator } from './focus-indicator.tsx'
import { SidebarFooter } from './sidebar-footer.tsx'
import { SidebarLinks } from './sidebar-links.tsx'
import { StatusBar } from './status-bar.tsx'

const siteTitle = 'RetroAssembly'
function getPostfixedTitle(title: string) {
  return title ? `${title} - ${siteTitle}` : siteTitle
}

interface AppLayoutProps {
  children: ReactNode
  title: string
}

export default function LibraryLayout({ children, title }: AppLayoutProps) {
  return (
    <>
      <title>{getPostfixedTitle(title)}</title>
      <div className='library-layout flex h-screen bg-[var(--accent-9)]'>
        <aside className='ml-4 flex w-64 shrink-0 flex-col pt-4 text-white'>
          <div className='flex items-center justify-center gap-2 pb-4 pt-2 font-bold'>
            <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
            RetroAssembly
          </div>
          <ScrollArea className='flex-1' size='2'>
            <SidebarLinks />
          </ScrollArea>
          <SidebarFooter />
        </aside>

        <div className='flex min-w-0 flex-1 flex-col gap-4 p-4'>
          <main className='relative flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
            {children}
          </main>
          <StatusBar />
        </div>
      </div>
      <FocusIndicator />
    </>
  )
}
