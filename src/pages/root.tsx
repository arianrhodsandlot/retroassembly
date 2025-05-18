import '@/styles/index.ts'
import '@/utils/global.ts'
import { Theme } from '@radix-ui/themes'
import { getContext } from 'hono/context-storage'
import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import type { Route } from './+types/root'
import { preferenceAtom } from './atoms.ts'

export function loader() {
  const { preference } = getContext().var
  return { preference }
}

export function Layout({ children }: { children: ReactNode }) {
  const { preference } = useLoaderData()
  const hydrateAtom = [preferenceAtom, preference] as const
  const hydrateAtoms = [hydrateAtom]

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider>
          <HydrationBoundary hydrateAtoms={hydrateAtoms}>
            <Theme accentColor='red'>{children}</Theme>
          </HydrationBoundary>
        </Provider>
        <ScrollRestoration />
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
