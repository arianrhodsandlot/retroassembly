import { ScrollArea } from '@radix-ui/themes'
import type { PropsWithChildren } from 'react'
import { Link, useLoaderData } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { PendingMask } from '../pending-mask.tsx'
import { DemoLoginButton } from './demo-login-button.tsx'
import { FocusIndicator } from './focus-indicator.tsx'
import { LayoutHeader } from './layout-header/layout-header.tsx'
import { LayoutMenu } from './layout-menu/layout-menu.tsx'
import { SearchModal } from './search-modal/search-modal.tsx'
import { SidebarContainer } from './sidebar-container.tsx'
import { SidebarLinks } from './sidebar-links/sidebar-links.tsx'
import { StatusBar } from './status-bar.tsx'

function getPostfixedTitle(title: string) {
  return title ? `${title} - ${metadata.title}` : metadata.title
}

export default function LibraryLayout({ children }: Readonly<PropsWithChildren>) {
  const { title } = useLoaderData()
  const isDemo = useIsDemo()

  return (
    <>
      <title>{getPostfixedTitle(title)}</title>

      <div className='library-layout p-safe bg-(--accent-9) flex flex-col lg:h-screen lg:flex-row'>
        {isDemo ? <DemoLoginButton /> : null}

        <LayoutHeader />

        <SidebarContainer>
          <div className='flex items-center justify-between px-4 pb-4'>
            <Link className='flex items-center gap-2 font-bold' reloadDocument to='/'>
              <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
              <span className='font-[Roboto_Slab_Variable] font-semibold'>{metadata.title}</span>
            </Link>
          </div>
          <ScrollArea className='flex-1' size='2'>
            <SidebarLinks />
          </ScrollArea>
          {isDemo ? null : (
            <div className='border-t border-t-white/30 py-2 '>
              <LayoutMenu />
            </div>
          )}
        </SidebarContainer>

        <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-2 pt-0 lg:p-4'>
          <main className='bg-(--color-background) relative flex flex-1 overflow-hidden rounded shadow-[0_0_12px] shadow-black/10 transition-colors duration-500'>
            {children}
          </main>
          <StatusBar />
        </div>
      </div>

      <SearchModal />

      <FocusIndicator />

      <PendingMask />
    </>
  )
}
