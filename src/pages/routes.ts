import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('page.tsx'),

  ...prefix('library', [
    index('library/page.tsx'),
    route('history', 'library/history/page.tsx'),
    route('platform/:platform', 'library/platform/page.tsx'),
    route('platform/:platform/rom/:fileName', 'library/platform/rom/page.tsx'),
  ]),
] satisfies RouteConfig
