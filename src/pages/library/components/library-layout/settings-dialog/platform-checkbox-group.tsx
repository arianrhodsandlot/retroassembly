import { Card, CheckboxCards } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { defaultPreference } from '@/constants/preference.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { PlatformCheckboxItem } from './platform-checkbox-item.tsx'
import { SettingsTitle } from './settings-title.tsx'
import { UpdateButton } from './update-button.tsx'

export function PlatformCheckboxGroup() {
  const { preference } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--order-checkbox-ascending]' />
        Enabled Platforms
      </SettingsTitle>
      <Card>
        <CheckboxCards.Root columns='4' size='1' value={preference.ui.platforms}>
          {platforms.map((platform) => (
            <PlatformCheckboxItem
              disabled={preference.ui.platforms.length < 2 && preference.ui.platforms.includes(platform.name)}
              key={platform.name}
              platform={platform}
            />
          ))}
        </CheckboxCards.Root>

        <div className='flex justify-end'>
          <UpdateButton preference={{ ui: { platforms: defaultPreference.ui.platforms } }}>
            <span className='icon-[mdi--undo]' />
            Reset to defaults
          </UpdateButton>
        </div>
      </Card>
    </div>
  )
}
