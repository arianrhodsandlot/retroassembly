import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  ...prefix('', [route(':language?', 'routes/home.tsx')]),

  ...prefix('login', [index('routes/login.tsx'), route('google', 'routes/login-google.ts')]),
  route('logout', 'routes/logout.ts'),

  ...prefix('library', [
    index('routes/library.tsx'),
    route('history', 'routes/library-history.tsx'),
    route('platform/:platform', 'routes/library-platform.tsx'),
    route('platform/:platform/rom/:fileName', 'routes/library-platform-rom.tsx'),
  ]),

  ...prefix('demo', [
    index('routes/demo.tsx'),
    route('platform/:platform', 'routes/demo-platform.tsx'),
    route('platform/:platform/rom/:fileName', 'routes/demo-platform-rom.tsx'),
  ]),
] satisfies RouteConfig
