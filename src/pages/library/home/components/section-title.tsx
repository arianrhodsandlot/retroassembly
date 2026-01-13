import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router'

export function SectionTitle({
  children,
  icon,
  link,
  suffix,
}: PropsWithChildren<{ icon: string; link: string; suffix?: ReactNode }>) {
  return (
    <h2 className='relative z-1 mx-4 flex items-center justify-between rounded bg-(--accent-4) p-4 text-2xl font-semibold text-(--accent-9)'>
      <Link className='flex items-center gap-2' to={link}>
        <span className={icon} />
        {children}
        <span className='icon-[mdi--keyboard-arrow-right]' />
      </Link>
      {suffix}
    </h2>
  )
}
