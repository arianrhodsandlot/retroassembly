import { Portal } from '@radix-ui/themes'
import type { PropsWithChildren } from 'react'
import { RadixTheme } from './radix-theme.tsx'

export function RadixThemePortal({ children }: PropsWithChildren) {
  return (
    <Portal>
      <RadixTheme>{children}</RadixTheme>
    </Portal>
  )
}
