import type { PropsWithChildren, ReactNode } from 'react'
import { NavLink } from 'react-router'

export function SectionTitle({
  children,
  icon,
  link,
  suffix,
}: PropsWithChildren<{ icon: string; link: string; suffix?: ReactNode }>) {
  return (
    <h2 className='relative z-1 mx-4 flex items-center justify-between rounded bg-(--accent-4) p-4 text-2xl font-semibold text-(--accent-9)'>
      <NavLink className='flex items-center gap-2' to={link}>
        {({ isPending }) => (
          <>
            <span className={icon} />
            {children}
            <span
              className={isPending ? 'icon-[svg-spinners--180-ring] text-sm' : 'icon-[mdi--keyboard-arrow-right]'}
            />
          </>
        )}
      </NavLink>
      {suffix}
    </h2>
  )
}
