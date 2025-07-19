import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { NavigatableLink } from '../navigatable-link.tsx'

export function SidebarLink({ active, children, to }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, { behavior: 'instant', scrollMode: 'if-needed' })
    }
  }, [active])

  return (
    <motion.div layout ref={ref}>
      <Button asChild size='3' variant='ghost'>
        <NavigatableLink
          className={clsx('group !m-0 !flex !h-auto !px-4 !py-2.5', {
            '!bg-[#651723]/60 !font-semibold !text-white': active,
            '!text-white hover:!bg-inherit': !active,
          })}
          data-sn-focus-style={JSON.stringify({
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          })}
          to={to}
        >
          <div className='flex h-auto w-full items-center justify-start gap-2'>{children}</div>
        </NavigatableLink>
      </Button>
    </motion.div>
  )
}
