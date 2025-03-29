import '@/styles/index.ts'
import { Provider } from 'jotai'
import type { ReactNode } from 'react'
import { Theme } from './components/radix-themes.ts'

export function Root({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>
        <Provider>
          <Theme accentColor='red'>{children}</Theme>
        </Provider>
      </body>
    </html>
  )
}
