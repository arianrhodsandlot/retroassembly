import type { Middleware } from 'waku/config'

export function shouldApplyMiddlware(pathname: string) {
  const [, subPath] = pathname.split('/')
  const pageSubPaths = ['', 'login', 'logout', 'library', 'RSC', 'api']
  return pageSubPaths.includes(subPath)
}

export function defineMiddleware(middleware: Middleware) {
  return middleware
}
