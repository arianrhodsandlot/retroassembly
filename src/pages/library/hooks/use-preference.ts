import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { useServerData } from './use-server-data.ts'

export function usePreference() {
  const [{ preference }, setServerData] = useServerData()

  const { data, isMutating: isLoading, trigger } = useSWRMutation('/api/v1/preference', async (url) => ky(url).json())

  function update(value) {
    if (value) {
      setServerData((prev) => ({ ...prev, preference: value }))
    }
  }

  async function sync() {
    await trigger()
    update(data)
  }

  return { isLoading, preference, sync, update }
}
