import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useNavigation } from 'react-router'
import { useShouldSuppressLoadingMaskAtom, useSpatialNavigationPaused } from '../atoms.ts'

export function useRouter() {
  const { state } = useNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [suppressLoadingMaskAtom, setSuppressLoadingMaskAtom] = useShouldSuppressLoadingMaskAtom()
  const pendingSilentReloadRef = useRef(false)

  const isNavigating = state === 'loading'
  const loadingMaskVisible = isNavigating && !suppressLoadingMaskAtom

  useEffect(() => {
    if (pendingSilentReloadRef.current && !isNavigating) {
      pendingSilentReloadRef.current = false
      setSuppressLoadingMaskAtom(false)
      setSpatialNavigationPaused(false)
    }
  }, [isNavigating, setSuppressLoadingMaskAtom, setSpatialNavigationPaused])

  async function reload({ suppressLoadingMask }: { suppressLoadingMask?: boolean } = {}) {
    if (suppressLoadingMask) {
      pendingSilentReloadRef.current = true
      setSuppressLoadingMaskAtom(true)
    }
    await navigate(location.pathname, { replace: true })
    if (!suppressLoadingMask) {
      setSpatialNavigationPaused(false)
    }
  }

  async function reloadSilently() {
    await reload({ suppressLoadingMask: true })
  }

  return { isNavigating, loadingMaskVisible, reload, reloadSilently }
}
