import { useLocation, useNavigate, useNavigation } from 'react-router'
import { useSpatialNavigationPaused } from '../atoms.ts'

export function useRouter() {
  const { state } = useNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  const isNavigating = state === 'loading'

  async function reload() {
    await navigate(location.pathname, { replace: true })
    setSpatialNavigationPaused(false)
  }

  return { isNavigating, reload }
}
