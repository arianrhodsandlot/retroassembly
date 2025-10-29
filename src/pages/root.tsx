import '@/styles/index.ts'
import '@/utils/client/global.ts'
import { getContext } from 'hono/context-storage'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import type { Route } from './+types/root.ts'
import { AppLayout } from './components/app-layout.tsx'
import { ErrorPage } from './components/error-page.tsx'

const disabledHost = 'next.retroassembly.com'
const targetUrl = 'https://retroassembly.com/'

export function loader({ request }) {
  const c = getContext()

  if (new URL(request.url).hostname === disabledHost) {
    throw c.redirect(targetUrl)
  }

  return getLoaderData()
}

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary(props: Readonly<Route.ErrorBoundaryProps>) {
  return <ErrorPage {...props} />
}
