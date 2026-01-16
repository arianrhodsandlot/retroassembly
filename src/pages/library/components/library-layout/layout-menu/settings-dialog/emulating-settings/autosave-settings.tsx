import { Card, Select } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

const INTERVAL_OPTIONS = [
  { label: 'Disabled', value: 0 },
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 60, value: 60 },
] as const

export function AutosaveSettings() {
  const { env } = useGlobalLoaderData()
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()
  const interval = preference.emulator.autoSaveInterval

  async function handleIntervalChange(value: string) {
    const newInterval = value === '0' ? 0 : Number.parseInt(value, 10)
    if (newInterval !== interval) {
      await update({
        emulator: {
          autoSaveInterval: newInterval,
        },
      })
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--content-save]' />
        {t('Save State')}
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <div>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--clock]' />
              {t('Auto save interval')}
              <Select.Root onValueChange={handleIntervalChange} value={String(interval)}>
                <Select.Trigger disabled={isLoading} />
                <Select.Content>
                  {INTERVAL_OPTIONS.map(({ label: _label, value }) => (
                    <Select.Item key={value} value={String(value)}>
                      {value === 0 ? t('Disabled') : `${value} ${t('seconds')}`}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </SettingsTitle>
            <div className='px-6 text-xs opacity-80'>
              {t('There are up to {{count}} auto save slots per game.', {
                count: Number(env.RETROASSEMBLY_RUN_TIME_MAX_AUTO_STATES_PER_ROM),
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
