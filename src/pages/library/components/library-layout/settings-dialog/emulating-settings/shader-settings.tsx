import { Card, HoverCard, RadioCards, Switch } from '@radix-ui/themes'
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
  { id: 'handheld/dot', name: 'dot', thumbnail: getShaderThumbnail('handheld/dot') },
  { id: 'handheld/lcd3x', name: 'lcd3x', thumbnail: getShaderThumbnail('handheld/lcd-3x') },
  { id: 'xbrz/xbrz-freescale', name: 'xbrz-freescale', thumbnail: getShaderThumbnail('xbrz/4xbrz') },
]

export function ShaderSettings() {
  const { isLoading, preference, update } = usePreference()

  async function handleShaderChange(shader: string) {
    if (shader !== preference.emulator.shader) {
      await update({
        emulator: {
          shader,
          videoSmooth: shader ? false : preference.emulator.videoSmooth,
        },
      })
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--video]' />
        Video
      </SettingsTitle>

      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <div>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--monitor-shimmer]' />
              Shader
            </SettingsTitle>
            <div className='px-6'>
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
                          <HoverCard.Content align='center' hideWhenDetached side='top' size='1'>
                            <a href={shader.thumbnail} rel='noreferrer noopener' target='_blank'>
                              <img
                                alt={shader.name}
                                className='size-48 rounded bg-zinc-400 object-contain object-center'
                                src={shader.thumbnail}
                              />
                            </a>
                          </HoverCard.Content>
                        </HoverCard.Root>
                      </div>
                    ) : null}
                  </div>
                ))}
              </RadioCards.Root>
            </div>
          </div>

          <div>
            <label className='flex items-center gap-2'>
              <SettingsTitle className='text-base'>
                <span className='icon-[mdi--blur]' />
                Bilinear filtering
              </SettingsTitle>
              <Switch
                checked={preference.emulator.videoSmooth}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  update({
                    emulator: {
                      shader: '',
                      videoSmooth: checked,
                    },
                  })
                }
              />
            </label>
            <div className='px-6 text-xs opacity-80'>
              Add a slight blur to the image to take the edge off of the hard pixel edges.
              <br />
              Cannot be enabled with shaders.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
