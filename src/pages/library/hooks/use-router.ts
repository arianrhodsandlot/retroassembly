import { useLocation, useNavigate, useNavigation } from 'react-router'
import { useShouldSuppressLoadingMaskAtom } from '../atoms.ts'

export function useRouter() {
  const { state } = useNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const [shouldSuppressLoadingMaskAtom, setShouldSuppressLoadingMaskAtom] = useShouldSuppressLoadingMaskAtom()

  const isNavigating = state === 'loading'
  const isReloading = isNavigating && shouldSuppressLoadingMaskAtom

  async function reload({ suppressLoadingMask }: { suppressLoadingMask?: boolean } = {}) {
    if (suppressLoadingMask) {
      setShouldSuppressLoadingMaskAtom(true)
    }
    await navigate(location.pathname, { replace: true })
    if (suppressLoadingMask) {
      setShouldSuppressLoadingMaskAtom(false)
    }
  }

  return { isReloading, reload }
}
