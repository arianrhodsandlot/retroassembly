import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { type FocusEvent, useLayoutEffect, useRef } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { NavigatableLink } from '../../navigatable-link.tsx'

function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
  scrollIntoView(event.currentTarget, {
    behavior: 'smooth',
    block: 'nearest',
    scrollMode: 'if-needed',
  })
}

export function SidebarLink({ active, children, title, to }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, { behavior: 'instant', scrollMode: 'if-needed' })
    }
  }, [active])

  return (
    <motion.div className='max-w-full flex-1' layout ref={ref}>
      <Button asChild size='2' variant='ghost'>
        <NavigatableLink
          className={clsx('sidebar-link', 'm-0! flex! h-auto! py-2.5! group', {
            active,
            'bg-[#651723]/60! font-semibold! text-white!': active,
            'text-white! hover:bg-inherit!': !active,
          })}
          data-sn-focus-style={JSON.stringify({
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          })}
          onFocus={handleFocus}
          title={title}
          to={to}
        >
          <div className='flex h-auto w-full items-center justify-start gap-2'>{children}</div>
        </NavigatableLink>
      </Button>
    </motion.div>
  )
}
