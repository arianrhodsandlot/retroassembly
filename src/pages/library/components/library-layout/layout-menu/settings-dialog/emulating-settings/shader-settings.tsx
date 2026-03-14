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
        {t('settings.video')}
      </SettingsTitle>

      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <div>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--monitor-shimmer]' />
              {t('settings.shader')}
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
                {t('settings.bilinearFiltering')}
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
              {t('settings.blurDescription')}
              <br />
              {t('settings.cannotEnableWithShaders')}
            </div>
          </div>

          <div>
            <label className='flex items-center gap-2'>
              <SettingsTitle className='mb-0 text-base'>
                <span className='icon-[mdi--fullscreen]' />
                {t('settings.goFullscreenOnLaunch')}
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
            <div className='px-6 text-xs opacity-80'>{t('emulator.fullscreenNotSupported')}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
