import type { PropsWithChildren } from 'react'

export function SectionTitle({ children, icon }: PropsWithChildren<{ icon: string }>) {
  return (
    <h2 className='flex items-center gap-2 px-8 text-3xl font-semibold'>
      <span className={icon} />
      {children}
    </h2>
  )
}
