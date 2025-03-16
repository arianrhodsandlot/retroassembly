import '@/styles/index.ts'
import type { ReactNode } from 'react'
import { Theme } from './components/radix-themes.ts'

export function Root({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>
        <Theme accentColor='red'>{children}</Theme>
      </body>
    </html>
  )
}
