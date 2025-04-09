import { ScrollArea } from '@radix-ui/themes'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PendingMask } from '../pending-mask/pending-mask.tsx'
import { FocusIndicator } from './focus-indicator.tsx'
import { SidebarContainer } from './sidebar-container.tsx'
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
        <SidebarContainer>
          <Link className='flex items-center justify-center gap-2 pb-4 pt-2 font-bold' reloadDocument to='/'>
            <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
          </Link>
          <ScrollArea className='flex-1' size='2'>
            <SidebarLinks />
          </ScrollArea>
          <div className='border-t border-t-white/30 py-2'>
            <SidebarFooter />
          </div>
        </SidebarContainer>

        <div className='flex min-w-0 flex-1 flex-col gap-4 p-4'>
          <main className='relative flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
            {children}
          </main>
          <StatusBar />
        </div>
      </div>

      <FocusIndicator />

      <PendingMask />
    </>
  )
}
