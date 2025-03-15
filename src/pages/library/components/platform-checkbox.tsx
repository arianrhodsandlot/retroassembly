import { CheckboxCards } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'

export function PlatformCheckbox() {
  return (
    <CheckboxCards.Root columns='4' size='1'>
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
