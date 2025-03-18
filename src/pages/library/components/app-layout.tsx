import { type ReactNode, type UIEventHandler, useMemo } from 'react'
import { getContext, getContextData } from 'waku/middleware/context'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { ServerDataContextProvider } from './server-data-context-provider.tsx'
import { SidebarFooter } from './sidebar-footer.tsx'
import { SidebarLinks } from './sidebar-links.tsx'

interface AppLayoutProps {
  append?: ReactNode
  children: ReactNode
  extendedServerData?: Record<string, unknown>
  MainScrollArea?: typeof ScrollArea
  onMainScroll?: UIEventHandler<HTMLDivElement>
  sidebar?: ReactNode
}

export default function AppLayout({ append, children, MainScrollArea = ScrollArea }: AppLayoutProps) {
  const { req } = getContext()
  const { preference } = getContextData()
  const serverData = useMemo(() => ({ preference }), [preference])

  return (
    <ServerDataContextProvider initial={serverData}>
      <div className='flex h-screen bg-[var(--accent-9)]'>
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
            <MainScrollArea className='z-1 relative flex flex-1' key={req.url.href} size='2'>
              <main className='min-h-full w-full p-4'>{children}</main>
            </MainScrollArea>
            {append}
          </div>
        </div>
      </div>
    </ServerDataContextProvider>
  )
}
