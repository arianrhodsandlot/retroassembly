import { Card, RadioCards, Select, Switch } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function GameEntrySettings() {
  const { isLoading, preference, update } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--eye]' />
        Display
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex flex-col gap-2'>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--grid]' />
              Game Cover Size
            </SettingsTitle>
            <div className='px-6'>
              <RadioCards.Root
                columns='8'
                onValueChange={(value) => update({ ui: { libraryCoverSize: value } })}
                size='1'
                value={preference.ui.libraryCoverSize}
              >
                {['extra-small', 'small', 'medium', 'large', 'extra-large'].map((size) => (
                  <RadioCards.Item key={size} value={size}>
                    <div className='flex items-center justify-start gap-1'>
                      <span
                        className={clsx(
                          'text-2xl',
                          {
                            'extra-large': 'icon-[mdi--size-extra-large]',
                            'extra-small': 'icon-[mdi--size-extra-small]',
                            large: 'icon-[mdi--size-large]',
                            medium: 'icon-[mdi--size-medium]',
                            small: 'icon-[mdi--size-small]',
                          }[size],
                        )}
                      />
                      <span className='capitalize'>{size.replace('-', ' ')}</span>
                    </div>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </div>
          </label>

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--text-long]' />
              Show Game Titles
            </SettingsTitle>
            <Switch
              checked={preference.ui.showTitle}
              disabled={isLoading}
              onCheckedChange={(checked) => update({ ui: { showTitle: checked } })}
            />
          </label>

          {preference.ui.showTitle ? (
            <label className='flex items-center gap-2'>
              <SettingsTitle className='mb-0 text-base'>
                <span className='icon-[mdi--earth]' />
                Show District on Game Titles
              </SettingsTitle>
              <Switch
                checked={preference.ui.showDistrictOnTitle}
                disabled={isLoading}
                onCheckedChange={(checked) => update({ ui: { showDistrictOnTitle: checked } })}
              />
            </label>
          ) : null}

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--text-long]' />
              Show Focus Indicators
            </SettingsTitle>
            <Select.Root
              onValueChange={(value) => update({ ui: { showFocusIndicators: value } })}
              size='2'
              value={preference.ui.showFocusIndicators}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value='auto'>Auto</Select.Item>
                <Select.Item value='always'>Always</Select.Item>
                <Select.Item value='never'>Never</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
        </div>
      </Card>
    </div>
  )
}
