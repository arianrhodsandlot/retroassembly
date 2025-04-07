import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('page.tsx'),

  route('library', 'library/page.tsx'),
  route('library/history', 'library/history/page.tsx'),
] satisfies RouteConfig
