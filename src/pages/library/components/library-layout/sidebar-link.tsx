'use client'
import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { Link, useRouter_UNSTABLE } from 'waku/router/client'
import { romAtom } from '../../atoms.ts'

function getPlatformLink(platform: unknown) {
  if (!platform) {
    return
  }
  return `/library/platform/${platform}`
}

export function SidebarLink({ children, to }) {
  const router = useRouter_UNSTABLE()
  const [rom] = useAtom(romAtom)

  const active = router.path === to || getPlatformLink(rom?.platform) === to
  return (
    <Button asChild size='3' variant={active ? 'ghost' : 'solid'}>
      <Link className={clsx('!m-0 !h-auto !px-4 !py-2.5', { '!bg-white': active })} scroll to={to}>
        <div className='flex h-auto w-full items-center justify-start gap-2 font-semibold'>{children}</div>
      </Link>
    </Button>
  )
}
