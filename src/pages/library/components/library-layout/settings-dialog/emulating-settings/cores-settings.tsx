import { Card, Select } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { type CoreName, coreOptionsMap } from '@/constants/core.ts'
import { platformMap } from '@/constants/platform.ts'
import { currentPlatformAtom } from '@/pages/atoms.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { CoreOptions } from './core-options.tsx'

export function CoresSettings() {
  const { isLoading, preference, update } = usePreference()
  const [currentPlatform] = useAtom(currentPlatformAtom)
  const [selectedPlatform, setSelectedPlatform] = useState(currentPlatform || preference.ui.platforms?.[0])

  if (!preference.ui.platforms?.length) {
    return
  }

  const { core } = preference.emulator.platform[selectedPlatform]
  const coreOptions = coreOptionsMap[core] || []

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
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--computer-classic]' />
        Emulation for
        <div className='ml-2 flex flex-col gap-2'>
          <Select.Root
            onValueChange={(value: typeof selectedPlatform) => setSelectedPlatform(value)}
            size='3'
            value={selectedPlatform}
          >
            <Select.Trigger disabled={isLoading} variant='ghost' />
            <Select.Content>
              {preference.ui.platforms.map((platform) => (
                <Select.Item key={platformMap[platform].name} value={platformMap[platform].name}>
                  <div className='flex items-center gap-2'>
                    <img
                      alt={platformMap[platform].displayName}
                      className='size-5 object-contain object-center'
                      src={getPlatformIcon(platformMap[platform].name, '')}
                    />
                    {platformMap[platform].displayName}
                  </div>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </SettingsTitle>

      <Card>
        <label className='flex items-center gap-2'>
          <SettingsTitle as='h4'>
            <span className='icon-[mdi--monitor-screenshot]' /> Emulator
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
                    {core}
                  </div>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        {coreOptions.length > 0 ? <CoreOptions core={core} coreOptions={coreOptions} /> : null}
      </Card>
    </div>
  )
}
