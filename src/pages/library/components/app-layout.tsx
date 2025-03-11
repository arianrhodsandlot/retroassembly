import { type ReactNode, type UIEventHandler, useMemo } from 'react'
import { getContext, getContextData } from 'waku/middleware/context'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { ServerDataContextProvider } from './server-data-context-provider.tsx'
import { SidebarLinks } from './sidebar-links.tsx'

interface AppLayoutProps {
  append?: ReactNode
  children: ReactNode
  MainScrollArea?: typeof ScrollArea
  onMainScroll?: UIEventHandler<HTMLDivElement>
  serverData?: Record<string, unknown>
  sidebar?: ReactNode
}

const defaultSidebar = <SidebarLinks />
export default function AppLayout({
  append,
  children,
  MainScrollArea = ScrollArea,
  serverData,
  sidebar = defaultSidebar,
}: AppLayoutProps) {
  const { req } = getContext()
  const { preference } = getContextData()
  const value = useMemo(() => ({ preference, ...serverData }), [preference, serverData])

  return (
    <ServerDataContextProvider value={value}>
      <div className='flex h-screen bg-[var(--theme)]'>
        <aside className='flex shrink-0 flex-col'>
          <div className='flex items-center justify-center gap-2 pb-4 pt-2 font-bold text-white'>
            <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
            RetroAssembly
          </div>
          <ScrollArea className='flex-1' size='2'>
            {sidebar}
          </ScrollArea>
        </aside>

        <div className='flex h-full flex-1'>
          <div className='relative my-4 mr-4 flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
            <MainScrollArea className='z-1 relative flex-1 p-4' key={req.url.pathname} size='2'>
              <main className='min-h-full'>{children}</main>
            </MainScrollArea>
            {append}
          </div>
        </div>
      </div>
    </ServerDataContextProvider>
  )
}
