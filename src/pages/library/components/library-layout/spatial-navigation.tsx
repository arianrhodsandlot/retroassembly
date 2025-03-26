'use client'
import { Portal, Theme } from '@radix-ui/themes'
import { type ReactNode, useLayoutEffect } from 'react'
import { useRouter_UNSTABLE } from 'waku'
import { useFocusIndicator } from '../../hooks/use-focus-indicator.ts'
import { useSpatialNavigation } from '../../hooks/use-spatial-navigation.ts'

export function SpatialNavigation({ children }: { children?: ReactNode }) {
  const { style, syncStyle } = useFocusIndicator()
  const router = useRouter_UNSTABLE()

  useSpatialNavigation()

  useLayoutEffect(() => {
    if (router.path) {
      syncStyle()
    }
  }, [router.path, syncStyle])

  return (
    <Portal>
      <Theme accentColor='red'>
        <div className='z-9999 pointer-events-none fixed rounded' style={style}>
          {children}
        </div>
      </Theme>
    </Portal>
  )
}
