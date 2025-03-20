import { Card, HoverCard, RadioCards } from '@radix-ui/themes'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { SettingsTitle } from '../settings-title.tsx'

function getShaderThumbnail(shader: string) {
  return getCDNUrl('libretro/docs', `/docs/image/shader/${shader}.png`)
}

const shaders = [
  { id: '', name: 'disabled', thumbnail: '' },
  { id: 'crt/crt-easymode', name: 'crt-easymode', thumbnail: getShaderThumbnail('crt/crt-easymode') },
  { id: 'crt/crt-nes-mini', name: 'crt-nes-mini', thumbnail: getShaderThumbnail('crt/crt-nes-mini') },
  { id: 'crt/crt-geom', name: 'crt-geom', thumbnail: getShaderThumbnail('crt/crt-geom') },
]

export function ShaderSettings() {
  const { isLoading, preference, update } = usePreference()

  async function handleShaderChange(shader: string) {
    await update({ emulator: { shader } })
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--monitor-shimmer]' />
        Shader
      </SettingsTitle>

      <Card>
        <RadioCards.Root
          columns='6'
          disabled={isLoading}
          onValueChange={handleShaderChange}
          size='1'
          value={preference.emulator.shader}
        >
          {shaders.map((shader) => (
            <div className='relative flex flex-col gap-1' key={shader.id}>
              <RadioCards.Item value={shader.id}>
                <span className={shader.id ? 'icon-[mdi--stars]' : 'icon-[mdi--do-not-disturb-alt]'} />
                <span className='font-semibold'>{shader.name}</span>
              </RadioCards.Item>
              {shader.thumbnail ? (
                <div className='absolute inset-0'>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <button
                        className='absolute inset-0 opacity-0'
                        onClick={() => handleShaderChange(shader.id)}
                        type='button'
                      >
                        select {shader.name}
                      </button>
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
    </div>
  )
}
