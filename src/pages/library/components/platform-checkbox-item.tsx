import { CheckboxCards } from '@radix-ui/themes'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import type { Platform } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { usePreference } from '../hooks/use-preference.ts'

export function PlatformCheckboxItem({ disabled, platform }: { disabled: boolean; platform: Platform }) {
  const { preference, update } = usePreference()

  const { isMutating, trigger } = useSWRMutation('/api/v1/preference', (url, { arg }: { arg: unknown }) =>
    ky.post(url, { json: arg }).json(),
  )

  async function handleClick() {
    if (isMutating) {
      return
    }

    const platforms = new Set(preference.ui.platforms)
    if (platforms.has(platform.name)) {
      platforms.delete(platform.name)
    } else {
      platforms.add(platform.name)
    }
    const changedPreference = { ui: { platforms: [...platforms] } }
    const result = await trigger(changedPreference)
    update(result)
  }

  return (
    <CheckboxCards.Item
      disabled={isMutating || disabled}
      key={platform.name}
      onClick={handleClick}
      value={platform.name}
    >
      <div className='flex items-center gap-2'>
        <img
          alt={platform.displayName}
          className='size-6 object-contain object-center'
          src={getPlatformIcon(platform.name, '')}
        />
        {platform.displayName}
      </div>
    </CheckboxCards.Item>
  )
}
