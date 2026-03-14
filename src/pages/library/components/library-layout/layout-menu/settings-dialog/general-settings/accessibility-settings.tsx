import { Card, Select, Switch } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import type { ResolvedPreference } from '#@/constants/preference.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { getGlobalCSSVars } from '#@/utils/isomorphic/misc.ts'
import { SettingsTitle } from '../settings-title.tsx'

const saturationOptions = range(100, -1, -10)

export function AccessibilitySettings() {
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()

  function updateGlobalSaturation(resolvedPreference: ResolvedPreference) {
    for (const [key, value] of Object.entries(getGlobalCSSVars(resolvedPreference))) {
      document.body.style.setProperty(key, value)
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--accessibility]' />
        {t('settings.accessibility')}
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-4 py-2 lg:flex-row'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--water-opacity]' />
              {t('settings.saturation')}
            </SettingsTitle>
            <Select.Root
              onValueChange={async (value) => {
                const saturation = Number.parseInt(value, 10)
                const resolvedPreference = await update({ ui: { saturation } })
                if (resolvedPreference) {
                  updateGlobalSaturation(resolvedPreference)
                }
              }}
              size='2'
              value={String(preference.ui.saturation)}
            >
              <Select.Trigger disabled={isLoading} />
              <Select.Content>
                {saturationOptions.map((option) => (
                  <Select.Item key={option} value={String(option)}>
                    {option}%
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--image]' />
              {t('settings.applyToImages')}
            </SettingsTitle>
            <Switch
              checked={preference.ui.saturationApplyToImages}
              disabled={isLoading}
              onCheckedChange={async (checked) => {
                const resolvedPreference = await update({ ui: { saturationApplyToImages: checked } })
                if (resolvedPreference) {
                  updateGlobalSaturation(resolvedPreference)
                }
              }}
            />
          </label>

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--monitor-eye]' />
              {t('settings.applyToGame')}
            </SettingsTitle>
            <Switch
              checked={preference.ui.saturationApplyToGame}
              disabled={isLoading}
              onCheckedChange={async (checked) => {
                const resolvedPreference = await update({ ui: { saturationApplyToGame: checked } })
                if (resolvedPreference) {
                  updateGlobalSaturation(resolvedPreference)
                }
              }}
            />
          </label>
        </div>
        <div className='text-xs opacity-50 lg:pl-6'>{t('settings.saturationDescription')}</div>
      </Card>
    </div>
  )
}
