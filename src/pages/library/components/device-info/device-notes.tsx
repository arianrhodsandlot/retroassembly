'use client'
import { Button } from '@radix-ui/themes'
import { useResizeObserver, useToggle } from '@react-hookz/web'
import { clsx } from 'clsx'
import { useLayoutEffect, useRef } from 'react'
import { useFocusIndicator } from '../../hooks/use-focus-indicator.ts'

export function DeviceNotes({ notes }: { notes: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [expandable, toggleExpandable] = useToggle(true)
  const [expanded, toggleExpanded] = useToggle()
  const { syncStyle } = useFocusIndicator()

  const showExpandButton = expandable && !expanded
  const showButton = showExpandButton || expanded

  useLayoutEffect(() => {
    if (typeof expanded === 'boolean') {
      syncStyle({ transition: false })
    }
  }, [expanded, syncStyle])

  useResizeObserver(ref, (entry) => {
    if (!expanded) {
      toggleExpandable(entry.target.scrollHeight > entry.target.clientHeight)
    }
  })

  return (
    <div>
      <div
        className={clsx(
          'prose-neutral prose  max-w-none whitespace-pre-line px-8 text-justify text-sm font-[Roboto_Slab_Variable] leading-relaxed',
          { 'line-clamp-5': !expanded },
        )}
        ref={ref}
      >
        {notes}
      </div>

      <div className='relative mt-1 flex justify-end px-6'>
        <div className='absolute -mt-1.5'>
          {showButton ? (
            <Button data-sn-enabled onClick={() => toggleExpanded()} size='1' type='button' variant='ghost'>
              <span
                className={clsx('size-5', {
                  'icon-[mdi--menu-up]': expanded,
                  'motion-duration-1000 icon-[mdi--menu-down] motion-preset-blink': showExpandButton,
                })}
              />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
