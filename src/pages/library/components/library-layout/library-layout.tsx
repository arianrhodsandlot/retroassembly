import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import type { ReactNode } from 'react'
import { getContextData } from 'waku/middleware/context'
import { preferenceAtom } from '@/pages/atoms.ts'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { SidebarFooter } from './sidebar-footer.tsx'
import { SidebarLinks } from './sidebar-links.tsx'

const siteTitle = 'RetroAssembly'
function getPostfixedTitle(title: string) {
  return title ? `${title} - ${siteTitle}` : siteTitle
}

interface AppLayoutProps {
  children: ReactNode
  title: string
}

export default function LibraryLayout({ children, title }: AppLayoutProps) {
  const { preference } = getContextData()

  return (
    <Provider>
      <HydrationBoundary hydrateAtoms={[[preferenceAtom, preference]]} options={{ enableReHydrate: true }}>
        <div className='flex h-screen bg-[var(--accent-9)]'>
          <title>{getPostfixedTitle(title)}</title>
          <aside className='ml-4 flex w-64 shrink-0 flex-col py-4 text-white'>
            <div className='flex items-center justify-center gap-2 pb-4 pt-2 font-bold'>
              <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
              RetroAssembly
            </div>
            <ScrollArea className='flex-1' size='2'>
              <SidebarLinks />
            </ScrollArea>
            <SidebarFooter />
          </aside>

          <div className='m-4 flex min-w-0 flex-1'>
            <div className='relative flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
              {children}
            </div>
          </div>
        </div>
      </HydrationBoundary>
    </Provider>
  )
}
