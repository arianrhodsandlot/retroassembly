import { CheckboxCards } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { usePreference } from '../hooks/use-preference.ts'
import { PlatformCheckboxItem } from './platform-checkbox-item.tsx'

export function PlatformCheckboxGroup() {
  const { preference } = usePreference()

  return (
    <label>
      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--order-checkbox-ascending]' />
        Enabled Platforms
      </h3>
      <CheckboxCards.Root columns='4' size='1' value={preference.ui.platforms}>
        {platforms.map((platform) => (
          <PlatformCheckboxItem
            disabled={preference.ui.platforms.length < 2 && preference.ui.platforms.includes(platform.name)}
            key={platform.name}
            platform={platform}
          />
        ))}
      </CheckboxCards.Root>
    </label>
  )
}
