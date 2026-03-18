import { Callout, Select } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import type { CoreName } from '#@/constants/core.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function CoreOptions({
  core,
  coreOptions,
}: Readonly<{
  core: CoreName
  coreOptions: { defaultOption?: string; name: string; options: string[]; title?: string }[]
}>) {
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()

  const coreOption = preference.emulator.core[core]

  async function handleValueChange(name: string, value: string) {
    await update({
      emulator: {
        core: {
          [core]: {
            [name]: value,
          },
        },
      },
    })
  }

  return (
    <div className='flex flex-col items-start'>
      <SettingsTitle>
        <span className='icon-[mdi--wrench]' /> {t('common.options')}
      </SettingsTitle>

      <div className='mt-3 flex flex-1 flex-col gap-2 px-6'>
        <Callout.Root size='1'>
          <Callout.Icon>
            <span className='icon-[mdi--warning]' />
          </Callout.Icon>
          <Callout.Text>{t('settings.advancedOptionsWarning')}</Callout.Text>
        </Callout.Root>

        <div className='mb-2 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-6'>
          {coreOptions.map(({ defaultOption, name, options, title }) => (
            <label className='flex w-fit flex-col gap-1 lg:flex-row' key={name}>
              <span className='text-sm'>{title || name}</span>

              <div>
                <Select.Root
                  onValueChange={(value) => handleValueChange(name, value)}
                  size='1'
                  value={coreOption?.[name] || defaultOption || options[0]}
                >
                  <Select.Trigger disabled={isLoading} />
                  <Select.Content>
                    {options.map((option) => (
                      <Select.Item key={option} value={option}>
                        {option}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
