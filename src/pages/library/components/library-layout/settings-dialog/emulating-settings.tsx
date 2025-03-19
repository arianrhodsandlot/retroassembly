import { Card, HoverCard, RadioCards, Select } from '@radix-ui/themes'
import { useState } from 'react'
import { coreOptionsMap } from '@/constants/core.ts'
import { platformMap } from '@/constants/platform.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { CoreOptions } from './core-options.tsx'

function getShaderThumbnail(shader: string) {
  return getCDNUrl('libretro/docs', `/docs/image/shader/${shader}.png`)
}

const shaders = [
  { id: '', name: 'disabled', thumbnail: '' },
  { id: 'crt/crt-easymode', name: 'crt-easymode', thumbnail: getShaderThumbnail('crt/crt-easymode') },
  { id: 'crt/crt-nes-mini', name: 'crt-nes-mini', thumbnail: getShaderThumbnail('crt/crt-nes-mini') },
  { id: 'crt/crt-geom', name: 'crt-geom', thumbnail: getShaderThumbnail('crt/crt-geom') },
]

export function EmulatingSettings() {
  const { isLoading, preference, update } = usePreference()
  const [selectedPlatform, setSelectedPlatform] = useState(preference.ui.platforms?.[0])

  if (!preference.ui.platforms?.length) {
    return
  }

  const { core } = preference.emulator.platform[selectedPlatform]
  const coreOptions = coreOptionsMap[core] || []

  async function handleShaderChange(shader: string) {
    await update({ emulator: { shader } })
  }

  return (
    <div>
      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--computer-classic]' />
        Shader
      </h3>
      <Card>
        <RadioCards.Root
          columns='6'
          disabled={isLoading}
          onValueChange={handleShaderChange}
          size='1'
          value={preference.emulator.shader}
        >
          {shaders.map((shader) => (
            <div className='group flex flex-col gap-1' key={shader.id}>
              <RadioCards.Item value={shader.id}>
                <span className='font-semibold'>{shader.name}</span>
              </RadioCards.Item>
              {shader.thumbnail ? (
                <div className='text-center'>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <div className='inline-flex items-center gap-1 text-xs text-black/40 opacity-0 group-hover:opacity-100'>
                        <span className='icon-[mdi--eye]' />
                        preview
                      </div>
                    </HoverCard.Trigger>
                    <HoverCard.Content size='1'>
                      <img
                        alt={shader.name}
                        className='size-96 rounded bg-zinc-400 object-contain object-center'
                        src={shader.thumbnail}
                      />
                    </HoverCard.Content>
                  </HoverCard.Root>
                </div>
              ) : null}
            </div>
          ))}
        </RadioCards.Root>
      </Card>

      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--computer-classic]' />
        Emulation for
        <div className='flex flex-col gap-2'>
          <Select.Root
            onValueChange={(value: typeof selectedPlatform) => setSelectedPlatform(value)}
            size='3'
            value={selectedPlatform}
          >
            <Select.Trigger variant='soft' />
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
      </h3>

      <Card className='mt-4'>
        <label className='flex items-center gap-2'>
          <h4 className='flex items-center gap-2 text-lg font-semibold'>
            <span className='icon-[mdi--monitor-screenshot]' /> Emulator
          </h4>
          <Select.Root size='2' value={core}>
            <Select.Trigger />
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
        </label>

        {coreOptions.length > 0 ? <CoreOptions coreOptions={coreOptions} /> : null}
      </Card>
    </div>
  )
}
