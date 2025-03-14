'use client'
import { Button } from '@radix-ui/themes'
import { useResizeObserver, useToggle } from '@react-hookz/web'
import clsx from 'clsx'
import { useRef } from 'react'

export function DeviceNotes({ notes }: { notes: string }) {
  const ref = useRef<HTMLDivElement>()
  const [expandable, toggleExpandable] = useToggle(true)
  const [expanded, toggleExpanded] = useToggle()
  useResizeObserver(ref, (entry) => {
    if (!expanded) {
      toggleExpandable(entry.target.scrollHeight > entry.target.clientHeight)
    }
  })
  const showExpandButton = expandable && !expanded
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
      <div className=' mt-1 flex justify-end px-6'>
        <div className='absolute -mt-2'>
          {showExpandButton ? (
            <Button onClick={() => toggleExpanded()} size='1' type='button' variant='ghost'>
              <span className='motion-duration-1000 icon-[mdi--menu-down] motion-preset-blink size-5' />
            </Button>
          ) : null}

          {expanded ? (
            <Button onClick={() => toggleExpanded()} size='1' type='button' variant='ghost'>
              <span className='icon-[mdi--menu-up] size-5' />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
