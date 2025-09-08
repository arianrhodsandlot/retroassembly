import type { PropsWithChildren, ReactNode } from 'react'

interface PageStatsProps extends PropsWithChildren {
  suffix?: ReactNode
}

export function PageStats({ children, suffix }: PageStatsProps) {
  return (
    <div className='mt-4 flex flex-col items-end justify-end gap-4 lg:flex-row lg:items-center lg:pr-4'>
      <div className='text-(--gray-11) flex items-center justify-end gap-2'>{children}</div>
      {suffix}
    </div>
  )
}
