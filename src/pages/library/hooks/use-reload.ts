import { useLocation, useNavigate } from 'react-router'

export function useReload() {
  const navigate = useNavigate()
  const location = useLocation()

  async function reload() {
    await navigate(location.pathname, { replace: true })
  }

  return { reload }
}
