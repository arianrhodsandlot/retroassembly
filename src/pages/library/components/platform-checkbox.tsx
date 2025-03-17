import { CheckboxCards } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { handleChange } from '../actions.ts'
import { usePreference } from '../hooks/use-preference.ts'

export function PlatformCheckbox() {
  const { ui } = usePreference()

  return (
    <CheckboxCards.Root columns='4' onValueChange={handleChange} size='1' value={ui?.platforms || []}>
      {platforms.map((platform) => (
        <CheckboxCards.Item key={platform.name} value={platform.name}>
          <div className='flex items-center gap-2'>
            <img
              alt={platform.displayName}
              className='size-6 object-contain object-center'
              src={getPlatformIcon(platform.name, '')}
            />
            {platform.displayName}
          </div>
        </CheckboxCards.Item>
      ))}
    </CheckboxCards.Root>
  )
}
