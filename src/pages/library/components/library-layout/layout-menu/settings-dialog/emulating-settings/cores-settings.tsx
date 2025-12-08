import { Card, Select } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { coreDisplayNameMap, type CoreName, coreOptionsMap } from '#@/constants/core.ts'
import { platformMap } from '#@/constants/platform.ts'
import { usePlatform } from '#@/pages/library/hooks/use-platform.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { getPlatformIcon } from '#@/utils/client/library.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { UpdateButton } from '../update-button.tsx'
import { BIOSOptions } from './bios-options.tsx'
import { CoreOptions } from './core-options.tsx'
import { PlatformShaderSettings } from './platform-shader-settings.tsx'

export function CoresSettings() {
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()
  const currentPlatform = usePlatform()
  const [selectedPlatform, setSelectedPlatform] = useState(currentPlatform?.name || preference.ui.platforms?.[0])

  if (!preference.ui.platforms?.length) {
    return
  }

  const { core } = preference.emulator.platform[selectedPlatform]
  const coreOptions = coreOptionsMap[core] || []
  const showReset = platformMap[selectedPlatform].cores.length > 0 && coreOptions.length > 0

  async function handleValueChange(value: CoreName) {
    await update({
      emulator: {
        platform: {
          [selectedPlatform]: {
            core: value,
          },
        },
      },
    })
  }

  return (
    <div className='mt-4'>
      <SettingsTitle>
        <span className='icon-[mdi--computer-classic]' />
        {t('Emulation for')}
        <div className='ml-2 flex flex-col gap-2'>
          <Select.Root
            onValueChange={(value: typeof selectedPlatform) => setSelectedPlatform(value)}
            size='3'
            value={selectedPlatform}
          >
            <Select.Trigger disabled={isLoading} variant='ghost'>
              <div className='flex items-center gap-2'>
                <img
                  alt={platformMap[selectedPlatform].displayName}
                  className={clsx('size-5 object-contain object-center', {
                    invert: ['ngp', 'wonderswan'].includes(selectedPlatform),
                  })}
                  loading='lazy'
                  src={getPlatformIcon(platformMap[selectedPlatform].name)}
                />
                {platformMap[selectedPlatform].displayName}
              </div>
            </Select.Trigger>
            <Select.Content>
              {preference.ui.platforms.map((platform) => (
                <Select.Item key={platformMap[platform].name} value={platformMap[platform].name}>
                  <div className='flex items-center gap-2'>
                    <img
                      alt={t(platformMap[platform].displayName)}
                      className={clsx('size-5 object-contain object-center', {
                        invert: ['ngp', 'wonderswan'].includes(platform),
                      })}
                      src={getPlatformIcon(platformMap[platform].name)}
                    />
                    {t(platformMap[platform].displayName)}
                  </div>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </SettingsTitle>

      <Card>
        <BIOSOptions platform={selectedPlatform} />

        <PlatformShaderSettings platform={selectedPlatform} />

        <div className='mt-2'>
          <label className='mt-2 flex items-center gap-2'>
            <SettingsTitle as='h4'>
              <span className='icon-[mdi--monitor-screenshot]' /> {t('Emulator')}
            </SettingsTitle>

            <Select.Root onValueChange={handleValueChange} size='2' value={core}>
              <Select.Trigger disabled={isLoading} />
              <Select.Content>
                {platformMap[selectedPlatform].cores.map((core) => (
                  <Select.Item key={core} value={core}>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-4 items-center justify-center'>
                        <span className='icon-[mdi--jigsaw] size-5' />
                      </div>
                      {coreDisplayNameMap[core]}
                    </div>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </label>

          {coreOptions.length > 0 ? <CoreOptions core={core} coreOptions={coreOptions} /> : null}

          {showReset ? (
            <div className='flex justify-end'>
              <UpdateButton
                preference={{
                  emulator: {
                    core: { [core]: null },
                    platform: { [selectedPlatform]: { core: null } },
                  },
                }}
              >
                <span className='icon-[mdi--undo]' />
                {t("Reset the emulator and it's option to defaults")}
              </UpdateButton>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
