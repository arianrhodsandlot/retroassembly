import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFocusIndicator } from '../../hooks/use-focus-indicator.ts'

export function DeviceNotes({ notes }: Readonly<{ notes: string }>) {
  const ref = useRef<HTMLDivElement>(null)
  const [expandable, setExpandable] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const { syncStyle } = useFocusIndicator()

  const showExpandButton = expandable && !expanded
  const showButton = showExpandButton || expanded

  useLayoutEffect(() => {
    if (typeof expanded === 'boolean') {
      syncStyle({ transition: false })
    }
  }, [expanded, syncStyle])

  useEffect(() => {
    const element = ref.current
    if (!element || expanded) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setExpandable(entry.target.scrollHeight > entry.target.clientHeight)
      }
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [expanded])

  return (
    <div>
      <div
        className={clsx(
          'prose max-w-none text-justify font-serif text-sm leading-relaxed whitespace-pre-line text-(--color-text)/70 lg:px-8',
          { 'line-clamp-5': !expanded },
        )}
        ref={ref}
      >
        {notes}
      </div>

      <div className='relative mt-1 flex justify-end lg:px-6'>
        <div className='absolute -mt-1.5'>
          {showButton ? (
            <Button data-sn-enabled onClick={() => setExpanded(!expanded)} size='1' type='button' variant='ghost'>
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
