import { Card, Select } from '@radix-ui/themes'
import { useLoaderData } from 'react-router'
import { locales } from '@/locales/index.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { i18n } from '@/utils/isomorphic/i18n.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function LanguageSettings() {
  const { detectedLanguage } = useLoaderData()
  const { isLoading, preference, update } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--translate-variant]' />
        Language
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='mb-0 text-base'>
              <span className='icon-[mdi--web]' />
              Interface Language
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
                  Auto ({locales.find(({ code }) => code === detectedLanguage)?.name})
                </Select.Item>
                {locales.map((locale) => (
                  <Select.Item key={locale.code} value={locale.code}>
                    {locale.name}
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
