import { Theme } from '@radix-ui/themes'
import { useAtomValue } from 'jotai'
import type { PropsWithChildren } from 'react'
import { preferenceAtom } from '../atoms.ts'

export function RadixTheme({ children }: Readonly<PropsWithChildren>) {
  const preference = useAtomValue(preferenceAtom)
  const accentColor = preference?.ui?.accentColor || 'red'

  return (
    <Theme accentColor={accentColor} grayColor='gray'>
      {children}
    </Theme>
  )
}
