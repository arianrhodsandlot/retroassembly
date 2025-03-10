import '@/styles/index.ts'
import type { ReactNode } from 'react'
import { getContextData } from 'waku/middleware/context'
import { Theme } from './components/radix-themes.ts'

export function Root({ children }: { children: ReactNode }) {
  const { preference } = getContextData()

  return (
    <html lang='en'>
      <head />
      <body data-theme={preference.ui.theme}>
        <Theme accentColor='red'>{children}</Theme>
      </body>
    </html>
  )
}
