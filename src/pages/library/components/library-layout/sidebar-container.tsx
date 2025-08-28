import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { usePreference } from '../../hooks/use-preference.ts'

export function SidebarContainer({ children }: Readonly<{ children: ReactNode }>) {
  const { preference } = usePreference()
  return (
    <aside
      className={clsx(
        'hidden w-64 shrink-0 flex-col pt-4 text-white transition-all lg:flex',
        preference.ui.showSidebar ? 'ml-4' : '-ml-64',
      )}
    >
      {children}
    </aside>
  )
}
