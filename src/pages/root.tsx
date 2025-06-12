import '@/styles/index.ts'
import '@/utils/global.ts'
import { getContext } from 'hono/context-storage'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
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

  const { currentUser, preference } = c.var
  return { currentUser, preference }
}

export function Layout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  return <ErrorPage {...props} />
}
