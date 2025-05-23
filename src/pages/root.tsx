import '@/styles/index.ts'
import '@/utils/global.ts'
import { Theme } from '@radix-ui/themes'
import { getContext } from 'hono/context-storage'
import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import type { ReactNode } from 'react'
import { isRouteErrorResponse, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import type { Route } from './+types/root'
import { preferenceAtom } from './atoms.ts'
import { Head } from './components/head.tsx'

const disabledHost = 'retroassembly.com'
const targetUrl = 'https://classic.retroassembly.com/'

export function loader({ request }) {
  const c = getContext()

  if (new URL(request.url).hostname === disabledHost) {
    throw c.redirect(targetUrl)
  }

  const { currentUser, preference } = c.var
  return { currentUser, preference }
}

export function Layout({ children }: { children: ReactNode }) {
  const { currentUser, preference } = useLoaderData()
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

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='container mx-auto p-4 pt-16'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full overflow-x-auto p-4'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
