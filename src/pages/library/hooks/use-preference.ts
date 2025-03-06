import { useServerData } from './use-server-data.ts'

export function usePreference() {
  const { preference } = useServerData()

  return preference
}
