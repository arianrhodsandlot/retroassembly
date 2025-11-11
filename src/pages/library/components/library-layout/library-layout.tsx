import { ScrollArea } from '@radix-ui/themes'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import { useGlobalLoaderData } from '@/pages/hooks/use-global-loader-data.ts'
import { getHomePath } from '@/utils/isomorphic/misc.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useFocusRestoration } from '../../hooks/use-focus-restoration.ts'
import { useViewport } from '../../hooks/use-viewport.ts'
import { PendingMask } from '../pending-mask.tsx'
import { DemoLoginButton } from './demo-login-button.tsx'
import { FocusIndicator } from './focus-indicator.tsx'
import { LayoutHeader } from './layout-header/layout-header.tsx'
import { LayoutMain } from './layout-main.tsx'
import { LayoutMenu } from './layout-menu/layout-menu.tsx'
import { SearchModal } from './search-modal/search-modal.tsx'
import { SidebarContainer } from './sidebar-container.tsx'
import { SidebarLinks } from './sidebar-links/sidebar-links.tsx'
import { StatusBar } from './status-bar.tsx'

function getPostfixedTitle(title: string) {
  return title ? `${title} - ${metadata.title}` : metadata.title
}

export default function LibraryLayout({ children }: Readonly<PropsWithChildren>) {
  const { language, title } = useGlobalLoaderData()
  const isDemo = useIsDemo()
  const { isLargeScreen } = useViewport()

  useFocusRestoration()

  return (
    <>
      <title>{getPostfixedTitle(title)}</title>

      <div className='library-layout p-safe flex flex-col'>
        {isDemo ? <DemoLoginButton /> : null}

        <LayoutHeader />

        <LayoutMain>{children}</LayoutMain>

        <div className='bg-(--accent-9) z-11 left-72 right-0 top-0 hidden h-4 lg:fixed lg:block' />
        <StatusBar />
        <SidebarContainer>
          <div className='flex items-center justify-between px-4 pb-4'>
            <Link className='flex items-center gap-2 font-bold' reloadDocument to={getHomePath(language)}>
              <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
              <span className='font-[Roboto_Slab_Variable] font-semibold'>{metadata.title}</span>
            </Link>
          </div>
          <ScrollArea className='flex-1' size='2'>
            <SidebarLinks />
          </ScrollArea>
          {isDemo ? null : (
            <div className='border-t border-t-white/30 py-2 '>{isLargeScreen ? <LayoutMenu /> : null}</div>
          )}
        </SidebarContainer>
      </div>

      <SearchModal />

      <FocusIndicator />

      <PendingMask />
    </>
  )
}
