import { useAtom } from 'jotai'
import useSWRMutation from 'swr/mutation'
import { client, type InferRequestType, parseResponse } from '@/api/client.ts'
import { defaultPreference, type PreferenceSnippet } from '@/constants/preference.ts'
import { preferenceAtom } from '@/pages/atoms.ts'

const { $post } = client.preference

export function usePreference() {
  const [preference, setPreference] = useAtom(preferenceAtom)

  const { isMutating: isLoading, trigger } = useSWRMutation(
    { endpoint: 'preference', method: 'post' },
    (key, { arg: json }: { arg: InferRequestType<typeof $post>['json'] }) => $post({ json }),
  )

  async function update(value: PreferenceSnippet) {
    if (value) {
      const newPreference = await parseResponse(trigger(value))
      setPreference(newPreference)
    }
  }

  return { isLoading, preference: preference || defaultPreference, setPreference, update }
}
