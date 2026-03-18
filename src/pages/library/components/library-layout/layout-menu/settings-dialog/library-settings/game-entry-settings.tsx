import { Card, RadioCards, Select, Switch } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { camelCase } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function GameEntrySettings() {
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--eye]' />
        {t('settings.display')}
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex flex-col gap-2'>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--grid]' />
              {t('settings.gameCoverSize')}
            </SettingsTitle>
            <div className='px-6'>
              <RadioCards.Root
                columns={{ initial: '1', md: '6' }}
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
                      <span className='capitalize'>{t(['common', camelCase(['size', size].join('-'))].join('.'))}</span>
                    </div>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </div>
          </label>

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--text-long]' />
              {t('settings.showGameTitles')}
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
                {t('settings.showDistrict')}
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
              {t('settings.showFocusIndicators')}
            </SettingsTitle>
            <Select.Root
              onValueChange={(value) => update({ ui: { showFocusIndicators: value } })}
              size='2'
              value={preference.ui.showFocusIndicators}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value='auto'>{t('common.auto')}</Select.Item>
                <Select.Item value='always'>{t('common.always')}</Select.Item>
                <Select.Item value='never'>{t('common.never')}</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
        </div>
      </Card>
    </div>
  )
}
