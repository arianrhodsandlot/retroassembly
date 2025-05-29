import { Theme } from '@radix-ui/themes'
import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import type { ReactNode } from 'react'
import { Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import { preferenceAtom } from '../atoms.ts'
import { Head } from './head.tsx'

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, preference } = useLoaderData() || {}
  const hydrateAtom = [preferenceAtom, preference] as const
  const hydrateAtoms = [hydrateAtom]

  return (
    <html lang='en'>
      <Head />
      <body>
        <Provider>
          <HydrationBoundary hydrateAtoms={hydrateAtoms}>
            <Theme accentColor='red'>{children}</Theme>
          </HydrationBoundary>
        </Provider>
        <ScrollRestoration />
        {currentUser ? (
          // eslint-disable-next-line biome-x/lint, @eslint-react/dom/no-dangerously-set-innerhtml
          <script dangerouslySetInnerHTML={{ __html: `globalThis.CURRENT_USER=${JSON.stringify(currentUser)}` }} />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
