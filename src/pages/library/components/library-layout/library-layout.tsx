import { ScrollArea } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { Link, useLoaderData } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'
import { Logo } from '#@/pages/components/logo.tsx'
import { getHomePath } from '#@/utils/isomorphic/misc.ts'
import type { getLibraryLoaderData } from '#@/utils/server/loader-data.ts'
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
import '../../utils/nostalgist.ts'
import { SidebarLinks } from './sidebar-links/sidebar-links.tsx'
import { SponsorMessage } from './sponsor-message.tsx'
import { StatusBar } from './status-bar.tsx'

function getPostfixedTitle(title: string) {
  return title ? `${title} - ${metadata.title}` : metadata.title
}

export default function LibraryLayout({ children }: Readonly<PropsWithChildren>) {
  const { language, title, recentlyLaunchedRoms } = useLoaderData<typeof getLibraryLoaderData>()
  const isDemo = useIsDemo()
  const { isLargeScreen } = useViewport()

  const [isSponsorMessageVisible, setIsSponsorMessageVisible] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    if (recentlyLaunchedRoms.length > 5 && !localStorage.getItem('supress-sponsor-message')) {
      setIsSponsorMessageVisible(true)
    }
    globalThis.addEventListener(
      'supress-sponsor-message',
      () => {
        setIsSponsorMessageVisible(false)
      },
      { signal: controller.signal },
    )
    return () => {
      controller.abort()
    }
  }, [recentlyLaunchedRoms])

  useFocusRestoration()

  return (
    <>
      <title>{getPostfixedTitle(title)}</title>

      <div className={clsx('library-layout flex min-h-screen flex-col bg-(--color-background)')}>
        {isDemo ? <DemoLoginButton /> : null}

        <LayoutHeader />

        <SidebarContainer>
          <div className='flex items-center justify-between px-4 pb-4'>
            <Link className='flex items-center gap-2 font-bold' reloadDocument to={getHomePath(language)}>
              <Logo height='32' width='32' />
              <span className='font-serif font-semibold'>{metadata.title}</span>
            </Link>
          </div>
          <ScrollArea className='flex-1' size='2'>
            <SidebarLinks />
          </ScrollArea>
          {isDemo ? null : (
            <div className='flex items-center justify-between border-t border-t-white/30 py-2'>
              {isLargeScreen ? <LayoutMenu /> : null}
              {isSponsorMessageVisible ? <SponsorMessage /> : null}
            </div>
          )}
        </SidebarContainer>

        <LayoutMain>{children}</LayoutMain>

        <div className='top-0 right-0 left-72 z-11 hidden h-4 bg-(--accent-9) lg:fixed lg:block' />
        <div className='inset-y-0 right-0 z-11 hidden h-full w-4 bg-(--accent-9) lg:fixed lg:block' />
        <StatusBar />
      </div>

      <SearchModal />

      <FocusIndicator />

      <PendingMask />
    </>
  )
}
