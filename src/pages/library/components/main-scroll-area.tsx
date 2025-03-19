'use client'
import { ScrollArea, type ScrollAreaProps } from '@radix-ui/themes'
import { type RefObject, useEffect, useRef } from 'react'
import { useRouter_UNSTABLE } from 'waku'

export function MainScrollArea({ ref, ...props }: { ref?: RefObject<HTMLDivElement | null> } & ScrollAreaProps) {
  const router = useRouter_UNSTABLE()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const refs = ref ? [scrollAreaRef, ref] : [scrollAreaRef]
  const { path, query } = router

  useEffect(() => {
    if (path) {
      scrollAreaRef.current?.scrollTo({
        behavior: query ? 'smooth' : 'instant',
        left: 0,
        top: 0,
      })
    }
  }, [path, query])

  return (
    <ScrollArea
      {...props}
      ref={(element) => {
        for (const ref of refs) {
          ref.current = element
        }
      }}
    />
  )
}
