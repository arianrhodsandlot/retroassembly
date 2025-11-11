import { Card, Select } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { locales } from '@/locales/locales.ts'
import { useGlobalLoaderData } from '@/pages/hooks/use-global-loader-data.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { dateFormatMap, dateFormats } from '@/utils/isomorphic/i18n.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function LanguageSettings() {
  const { i18n, t } = useTranslation()
  const { detectedLanguage } = useGlobalLoaderData()
  const { isLoading, preference, update } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--translate-variant]' />
        {t('Language')}
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--web]' />
              {t('Interface Language')}
            </SettingsTitle>
            <Select.Root
              onValueChange={async (value) => {
                await update({ ui: { language: value } })
                const language = value === 'auto' ? detectedLanguage : value
                i18n.changeLanguage(language)
              }}
              size='2'
              value={preference.ui.language}
            >
              <Select.Trigger disabled={isLoading} />
              <Select.Content>
                <Select.Item value={'auto'}>
                  {t('Auto')} ({locales.find(({ code }) => code === detectedLanguage)?.name})
                </Select.Item>
                {locales.map((locale) => (
                  <Select.Item key={locale.code} value={locale.code}>
                    {locale.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--calendar-clock]' />
              {t('Date Format')}
            </SettingsTitle>
            <Select.Root
              onValueChange={async (value) => {
                await update({ ui: { dateFormat: value } })
              }}
              size='2'
              value={preference.ui.dateFormat}
            >
              <Select.Trigger disabled={isLoading} />
              <Select.Content>
                <Select.Item value='auto'>
                  {t('Auto')} ({dateFormatMap[i18n.language]})
                </Select.Item>
                {dateFormats.map((format) => (
                  <Select.Item key={format} value={format}>
                    {format}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>
        </div>
      </Card>
    </div>
  )
}
