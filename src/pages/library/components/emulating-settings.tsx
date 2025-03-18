import { Select } from '@radix-ui/themes'
import { useState } from 'react'
import { coreOptionsMap } from '@/constants/core.ts'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { usePreference } from '../hooks/use-preference.ts'
import { CoreOptions } from './core-options.tsx'

export function EmulatingSettings() {
  const { preference } = usePreference()
  const [selectedPlatform, setSelectedPlatform] = useState(preference.ui.platforms?.[0])

  if (!preference.ui.platforms?.length) {
    return
  }

  const { core } = preference.emulator.platform[selectedPlatform]
  const coreOptions = coreOptionsMap[core] || []

  return (
    <div className='mt-4'>
      <label>
        <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
          <span className='icon-[mdi--computer-classic]' /> Platform
        </h3>
        <div className='flex flex-col gap-2 px-6'>
          <Select.Root
            onValueChange={(value: typeof selectedPlatform) => setSelectedPlatform(value)}
            size='3'
            value={selectedPlatform}
          >
            <Select.Trigger variant='ghost' />
            <Select.Content>
              {preference.ui.platforms.map((platform) => (
                <Select.Item key={platformMap[platform].name} value={platformMap[platform].name}>
                  <div className='flex items-center gap-2'>
                    <img
                      alt={platformMap[platform].displayName}
                      className='size-6 object-contain object-center'
                      src={getPlatformIcon(platformMap[platform].name, '')}
                    />
                    {platformMap[platform].displayName}
                  </div>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </label>

      <label>
        <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
          <span className='icon-[mdi--monitor-screenshot]' /> Emulator
        </h3>
        <div className='flex flex-col gap-2 px-6'>
          <Select.Root size='3' value={core}>
            <Select.Trigger variant='ghost' />
            <Select.Content>
              {platformMap[selectedPlatform].cores.map((core) => (
                <Select.Item key={core} value={core}>
                  <div className='flex items-center gap-2'>
                    <div className='flex size-6 items-center justify-center'>
                      <span className='icon-[mdi--jigsaw] size-5' />
                    </div>
                    {core}
                  </div>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </label>

      {coreOptions.length > 0 ? <CoreOptions coreOptions={coreOptions} /> : null}
    </div>
  )
}
