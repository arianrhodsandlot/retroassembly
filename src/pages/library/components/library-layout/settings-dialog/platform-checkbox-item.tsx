import { CheckboxCards } from '@radix-ui/themes'
import type { Platform } from '@/constants/platform.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getPlatformIcon } from '@/utils/rom.ts'

export function PlatformCheckboxItem({ disabled, platform }: { disabled: boolean; platform: Platform }) {
  const { isLoading, preference, update } = usePreference()

  async function handleClick() {
    if (isLoading) {
      return
    }

    const platforms = new Set(preference.ui.platforms)
    if (platforms.has(platform.name)) {
      platforms.delete(platform.name)
    } else {
      platforms.add(platform.name)
    }
    await update({ ui: { platforms: [...platforms] } })
  }

  return (
    <CheckboxCards.Item
      disabled={isLoading || disabled}
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
