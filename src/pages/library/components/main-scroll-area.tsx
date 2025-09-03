import { ScrollArea, type ScrollAreaProps } from '@radix-ui/themes'
import { type RefObject, useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export function MainScrollArea({ ref, ...props }: { ref?: RefObject<HTMLDivElement | null> } & ScrollAreaProps) {
  const location = useLocation()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const refs = ref ? [scrollAreaRef, ref] : [scrollAreaRef]

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      behavior: location.search ? 'smooth' : 'instant',
      left: 0,
      top: 0,
    })
  }, [location])

  return (
    <ScrollArea
      {...props}
      className='z-1 relative flex flex-1'
      ref={(element) => {
        for (const ref of refs) {
          ref.current = element
        }
      }}
      size='2'
    />
  )
}
