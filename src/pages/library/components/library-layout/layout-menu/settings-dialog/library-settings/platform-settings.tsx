import { Card, CheckboxCards } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { UpdateButton } from '../update-button.tsx'
import { PlatformCheckboxItem } from './platform-checkbox-item.tsx'

export function PlatformSettings() {
  const { preference } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--order-checkbox-ascending]' />
        Enabled Platforms
      </SettingsTitle>
      <Card>
        <CheckboxCards.Root columns={{ initial: '1', md: '4' }} size='1' value={preference.ui.platforms}>
          {platforms.map((platform) => (
            <PlatformCheckboxItem
              disabled={preference.ui.platforms.length < 2 && preference.ui.platforms.includes(platform.name)}
              key={platform.name}
              platform={platform}
            />
          ))}
        </CheckboxCards.Root>

        <div className='mt-4 flex justify-end gap-4'>
          {platforms.length > preference.ui.platforms.length ? (
            <UpdateButton preference={{ ui: { platforms: platforms.map(({ name }) => name) } }}>
              <span className='icon-[mdi--checkbox-multiple-marked]' />
              Select all
            </UpdateButton>
          ) : null}

          <UpdateButton preference={{ ui: { platforms: null } }}>
            <span className='icon-[mdi--undo]' />
            Reset to defaults
          </UpdateButton>
        </div>
      </Card>
    </div>
  )
}
