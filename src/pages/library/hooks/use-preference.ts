import { useAtom } from 'jotai'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { defaultPreference, type PreferenceSnippet, type ResolvedPreference } from '@/constants/preference.ts'
import { preferenceAtom } from '@/pages/atoms.ts'

export function usePreference() {
  const [preference, setPreference] = useAtom(preferenceAtom)

  const { isMutating: isLoading, trigger } = useSWRMutation('/api/v1/preference', (url, { arg }: { arg: unknown }) =>
    ky.post<ResolvedPreference>(url, { json: arg }).json(),
  )

  async function update(value: PreferenceSnippet) {
    if (value) {
      const newPreference = await trigger(value)
      setPreference(newPreference)
    }
  }

  return { isLoading, preference: preference || defaultPreference, update }
}
