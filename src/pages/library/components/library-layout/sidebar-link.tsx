import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { Link } from 'waku/router/client'

export function SidebarLink({ active, children, to }) {
  return (
    <Button asChild size='3' variant={active ? 'ghost' : 'solid'}>
      <Link className={clsx('!m-0 !h-auto !px-4 !py-2.5', { '!bg-white': active })} scroll to={to}>
        <div className='flex h-auto w-full items-center justify-start gap-2 font-semibold'>{children}</div>
      </Link>
    </Button>
  )
}
