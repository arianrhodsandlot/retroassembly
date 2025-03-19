'use client'
import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { Link, useRouter_UNSTABLE } from 'waku/router/client'

export function SidebarLink({ children, href }) {
  const router = useRouter_UNSTABLE()
  const active = router.path === href
  return (
    <Button asChild size='3' variant={active ? 'ghost' : 'solid'}>
      <Link className={clsx('!m-0 !h-auto !px-4 !py-2.5', { '!bg-white': active })} scroll to={href}>
        <div className='flex h-auto w-full items-center justify-start gap-2 font-semibold'>{children}</div>
      </Link>
    </Button>
  )
}
