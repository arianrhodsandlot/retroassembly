import { createPages } from 'waku'
import { getContext } from 'waku/middleware/context'
import type { PathsForPages } from 'waku/router'
import { api } from '@/api/index.ts'
import { HistoryPage } from '@/pages/library/history/page.tsx'
import { LibraryPage } from '@/pages/library/page.tsx'
import { PlatformPage } from '@/pages/library/platform/page.tsx'
import { RomPage } from '@/pages/library/platform/rom/page.tsx'
import { LoginPage } from '@/pages/login/page.tsx'
import { HomePage } from '@/pages/page.tsx'
import { Root } from '@/pages/root.tsx'

async function apiHandler() {
  const { req } = getContext()
  const request = new Request(req.url, req)
  return await api.fetch(request)
}

const pages: ReturnType<typeof createPages> = createPages(({ createApi, createPage, createRoot }) =>
  Promise.resolve([
    createRoot({ component: Root, render: 'dynamic' }),

    createPage({ component: HomePage, path: '/', render: 'dynamic' }),
    createPage({ component: LoginPage, path: '/login', render: 'dynamic' }),
    createPage({ component: LibraryPage, path: '/library', render: 'dynamic' }),
    createPage({ component: HistoryPage, path: '/library/history', render: 'dynamic' }),
    createPage({ component: PlatformPage, path: '/library/platform/[platform]', render: 'dynamic' }),
    createPage({ component: RomPage, path: '/library/platform/[platform]/rom/[fileName]', render: 'dynamic' }),
    createPage({ component: RomPage, path: '/library/rom/[id]', render: 'dynamic' }),

    createApi({
      handlers: { DELETE: apiHandler, GET: apiHandler, PATCH: apiHandler, POST: apiHandler, PUT: apiHandler },
      path: '/api/[...all]',
      render: 'dynamic',
    }),
  ]),
)

declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<typeof pages>
  }

  interface CreatePagesConfig {
    pages: typeof pages
  }
}

export default pages
