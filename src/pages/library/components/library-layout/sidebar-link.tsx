import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { Link } from 'waku'

export function SidebarLink({ active, children, to }) {
  return (
    <motion.div layout>
      <Button asChild size='3' variant={active ? 'ghost' : 'solid'}>
        <Link className={clsx('group !m-0 !flex !h-auto !px-4 !py-2.5', { '!bg-white': active })} scroll to={to}>
          <div className='flex h-auto w-full items-center justify-start gap-2 font-semibold'>{children}</div>
        </Link>
      </Button>
    </motion.div>
  )
}
