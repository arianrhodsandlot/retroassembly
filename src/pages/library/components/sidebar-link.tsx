import { clsx } from 'clsx'
import { Link } from 'waku/router/client'

export function SidebarLink({ active = false, children, href }) {
  return (
    <div className='relative'>
      <Link
        className={clsx(
          'mx-2 flex items-center gap-2 rounded px-4 py-2.5 font-semibold  transition-colors  hover:text-white',
          active ? 'cursor-default bg-rose-900 font-semibold text-white' : 'text-white/80 ',
        )}
        scroll
        to={href}
        unstable_pending={<div className='z-1 absolute top-0 size-full' />}
      >
        {children}
      </Link>
    </div>
  )
}
