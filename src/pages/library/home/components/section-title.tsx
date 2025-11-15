import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router'

export function SectionTitle({
  children,
  icon,
  link,
  suffix,
}: PropsWithChildren<{ icon: string; link: string; suffix?: ReactNode }>) {
  return (
    <h2 className='bg-(--accent-4) text-(--accent-9) mx-4 flex items-center justify-between rounded p-4 text-2xl font-semibold'>
      <Link className='flex items-center gap-2' to={link}>
        <span className={icon} />
        {children}
        <span className='icon-[mdi--keyboard-arrow-right]' />
      </Link>
      {suffix}
    </h2>
  )
}
