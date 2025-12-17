import { Switch } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import type { PlatformName } from '#@/constants/platform.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { ShaderSelect } from './shader-select.tsx'

export function PlatformShaderSettings({ platform }: Readonly<{ platform: PlatformName }>) {
  const { t } = useTranslation()

  const { isLoading, preference, update } = usePreference()

  const platformPreference = preference.emulator.platform[platform]

  async function updatePlatformShader(shader: string) {
    await update({ emulator: { platform: { [platform]: { shader } } } })
  }

  async function handleShaderChange(shader: string) {
    await updatePlatformShader(shader === 'none' ? '' : shader)
  }

  async function handleInheritChange(checked: boolean) {
    await updatePlatformShader(checked ? '' : 'inherit')
  }

  return (
    <div>
      <SettingsTitle className='text-base'>
        <label className='flex items-center gap-2'>
          <SettingsTitle className='mb-0 text-base'>
            <span className='icon-[mdi--monitor-shimmer]' />
            {t('Platform-specific shader')}
          </SettingsTitle>
          <Switch
            checked={platformPreference.shader !== 'inherit'}
            disabled={isLoading}
            onCheckedChange={handleInheritChange}
          />
        </label>
      </SettingsTitle>
      <div className={clsx('px-6', { hidden: platformPreference.shader === 'inherit' })}>
        <ShaderSelect
          disabled={isLoading}
          onValueChange={handleShaderChange}
          value={platformPreference.shader || 'none'}
        />
      </div>
    </div>
  )
}
