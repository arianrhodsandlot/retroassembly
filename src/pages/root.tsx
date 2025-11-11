import '@/styles/index.ts'
import '@/utils/client/global.ts'
import { getContext } from 'hono/context-storage'
import { match } from 'path-to-regexp'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { getHomePath } from '@/utils/isomorphic/misc.ts'
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

  const path = c.req.path.endsWith('.data') ? c.req.path.slice(0, -5) : c.req.path
  const matched = match('/{:language}')(path)
  const { resources = {} } = c.var.i18n.options
  const isHome = matched && (!matched.params.language || `${matched.params.language}` in resources)
  const homeHeadElements = Object.keys(resources).map((language) => ({
    props: { href: getHomePath(language), hrefLang: language, key: language, rel: 'alternate' },
    type: 'link',
  }))
  const headElements = isHome ? homeHeadElements : []

  return getLoaderData({ headElements })
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
