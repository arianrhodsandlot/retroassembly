import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { type FocusEvent, useLayoutEffect, useRef } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { NavigatableLink } from '../../navigatable-link.tsx'

async function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
  await scrollIntoView(event.currentTarget, {
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
    <div className='max-w-full flex-1' ref={ref}>
      <Button asChild size='2' variant='ghost'>
        <NavigatableLink
          className={clsx('sidebar-link', 'group m-0! flex! h-auto! py-2.5!', {
            active,
            'bg-(--accent-12)! font-semibold! text-white! [.dark_.sidebar-link]:bg-(--accent-5)!': active,
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
    </div>
  )
}
