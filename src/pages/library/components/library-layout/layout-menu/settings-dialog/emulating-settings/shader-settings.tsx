import { Card, Switch } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { ShaderSelect } from './shader-select.tsx'

export function ShaderSettings() {
  const { t } = useTranslation()
  const { isLoading, preference, update } = usePreference()

  async function handleShaderChange(shader: string) {
    const actualShader = shader === 'none' ? '' : shader
    if (actualShader !== preference.emulator.shader) {
      await update({
        emulator: {
          shader: actualShader,
          videoSmooth: actualShader ? false : preference.emulator.videoSmooth,
        },
      })
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--video]' />
        {t('Video')}
      </SettingsTitle>

      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <div>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--monitor-shimmer]' />
              {t('Shader')}
              <ShaderSelect
                disabled={isLoading}
                onValueChange={handleShaderChange}
                value={preference.emulator.shader || 'none'}
              />
            </SettingsTitle>
          </div>

          <div>
            <label className='flex items-center gap-2'>
              <SettingsTitle className='mb-0 text-base'>
                <span className='icon-[mdi--blur]' />
                {t('Bilinear filtering')}
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
              {t('Add a slight blur to the image to take the edge off of the hard pixel edges.')}
              <br />
              {t('Cannot be enabled with shaders.')}
            </div>
          </div>

          <div>
            <label className='flex items-center gap-2'>
              <SettingsTitle className='mb-0 text-base'>
                <span className='icon-[mdi--fullscreen]' />
                {t('Go fullscreen on launch')}
              </SettingsTitle>
              <Switch
                checked={preference.emulator.fullscreen}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  update({
                    emulator: {
                      fullscreen: checked,
                    },
                  })
                }
              />
            </label>
            <div className='px-6 text-xs opacity-80'>{t('Some browsers may not support fullscreen mode.')}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
