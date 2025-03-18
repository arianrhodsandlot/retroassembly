import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import type { Preference, PreferenceSnippet } from '@/constants/preference.ts'
import { useServerData } from './use-server-data.ts'

export function usePreference() {
  const [{ preference }, setServerData] = useServerData()

  const { isMutating: isLoading, trigger } = useSWRMutation('/api/v1/preference', (url, { arg }: { arg: unknown }) =>
    ky.post<Preference>(url, { json: arg }).json(),
  )

  async function update(value: PreferenceSnippet) {
    if (value) {
      const newPreference = await trigger(value)
      setServerData((prev) => ({ ...prev, preference: newPreference }))
    }
  }

  return { isLoading, preference, update }
}
