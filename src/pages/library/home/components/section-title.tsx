import type { PropsWithChildren } from 'react'

export function SectionTitle({ children, icon }: PropsWithChildren<{ icon: string }>) {
  return (
    <h2 className='bg-(--accent-4) text-(--accent-9) mx-4 flex items-center gap-2 rounded p-4 text-2xl font-semibold'>
      <span className={icon} />
      {children}
    </h2>
  )
}
