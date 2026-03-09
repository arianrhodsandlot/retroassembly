import { Theme } from '@radix-ui/themes'
import type { PropsWithChildren } from 'react'

export function RadixTheme({ children }: Readonly<PropsWithChildren>) {
  return (
    <Theme accentColor='red' grayColor='gray'>
      {children}
    </Theme>
  )
}
