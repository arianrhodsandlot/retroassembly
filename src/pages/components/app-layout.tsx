import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import { preferenceAtom } from '../atoms.ts'
import { CookieConsent } from './cookie-consent.tsx'
import { Head } from './head.tsx'
import { RadixTheme } from './radix-theme.tsx'

export function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { currentUser, preference } = useLoaderData() || {}
  const hydrateAtom = [preferenceAtom, preference] as const
  const hydrateAtoms = [hydrateAtom]

  return (
    <html lang='en' suppressHydrationWarning>
      <Head />
      <body>
        <RadixTheme>
          <ThemeProvider attribute='class'>
            <Provider>
              <HydrationBoundary hydrateAtoms={hydrateAtoms}>
                {children}
                <CookieConsent />
              </HydrationBoundary>
            </Provider>
          </ThemeProvider>
        </RadixTheme>
        <ScrollRestoration />
        {currentUser ? (
          <script dangerouslySetInnerHTML={{ __html: `globalThis.CURRENT_USER=${JSON.stringify(currentUser)}` }} />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
