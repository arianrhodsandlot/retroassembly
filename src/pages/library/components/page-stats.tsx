import type { PropsWithChildren, ReactNode } from 'react'

interface PageStatsProps extends PropsWithChildren {
  suffix?: ReactNode
}

export function PageStats({ children, suffix }: Readonly<PageStatsProps>) {
  return (
    <div className='mt-4 flex flex-col items-end justify-end gap-4 lg:flex-row lg:items-center lg:pr-4'>
      <div className='flex items-center justify-end gap-2 text-(--gray-11)'>{children}</div>
      {suffix}
    </div>
  )
}
