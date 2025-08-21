import { useLocation, useNavigate, useNavigation } from 'react-router'
import { useShouldSuppressLoadingMaskAtom } from '../atoms.ts'

export function useRouter() {
  const { state } = useNavigation()
  const navigate = useNavigate()
  const location = useLocation()
  const [suppressLoadingMaskAtom, setSuppressLoadingMaskAtom] = useShouldSuppressLoadingMaskAtom()

  const isNavigating = state === 'loading'
  const isReloading = isNavigating && suppressLoadingMaskAtom

  async function reload({ suppressLoadingMask }: { suppressLoadingMask?: boolean } = {}) {
    if (suppressLoadingMask) {
      setSuppressLoadingMaskAtom(true)
    }
    await navigate(location.pathname, { replace: true })
    if (suppressLoadingMask) {
      setSuppressLoadingMaskAtom(false)
    }
  }

  return { isReloading, reload }
}
