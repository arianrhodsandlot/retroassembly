export function shouldApplyMiddlware(pathname: string) {
  const [, subPath] = pathname.split('/')
  const pageSubPaths = ['', 'login', 'library', 'RSC', 'api']
  return pageSubPaths.includes(subPath)
}
