import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export function SidebarContainer({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <aside
      className={clsx(
        'z-1 hidden w-72 shrink-0 flex-col bg-(--accent-9) px-4 pt-4 text-white transition-all lg:fixed lg:top-0 lg:left-0 lg:flex lg:h-dvh',
      )}
    >
      {children}
    </aside>
  )
}
