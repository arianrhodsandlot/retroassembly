import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('page.tsx'),

  ...prefix('login', [index('login/page.tsx'), route('google', 'login/google/page.ts')]),
  route('logout', 'logout/page.ts'),

  ...prefix('library', [
    index('library/page.tsx'),
    route('history', 'library/history/page.tsx'),
    route('platform/:platform', 'library/platform/page.tsx'),
    route('platform/:platform/rom/:fileName', 'library/platform/rom/page.tsx'),
  ]),
] satisfies RouteConfig
