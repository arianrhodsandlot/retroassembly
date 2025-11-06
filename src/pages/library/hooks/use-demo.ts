import { useLocation } from 'react-router'

export function useIsDemo() {
  const location = useLocation()
  const segments = location.pathname.split('/').slice(1)
  return segments[0] === 'demo'
}
