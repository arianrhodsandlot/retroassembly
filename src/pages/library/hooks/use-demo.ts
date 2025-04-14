import { useLocation } from 'react-router'

export function useIsDemo() {
  const location = useLocation()
  return location.pathname === '/demo' || location.pathname.startsWith('/demo/')
}
