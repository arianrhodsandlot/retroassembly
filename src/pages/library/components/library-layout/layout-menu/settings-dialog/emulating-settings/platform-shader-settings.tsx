import { HoverCard, RadioCards, Switch } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import type { PlatformName } from '#@/constants/platform.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { shaders } from './shaders.ts'

export function PlatformShaderSettings({ platform }: Readonly<{ platform: PlatformName }>) {
  const { t } = useTranslation()

  const { isLoading, preference, update } = usePreference()

  const platformPreference = preference.emulator.platform[platform]

  async function updatePlatformShader(shader: string) {
    await update({ emulator: { platform: { [platform]: { shader } } } })
  }

  async function handleShaderChange(shader: string) {
    await updatePlatformShader(shader)
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
        <RadioCards.Root
          columns={{ initial: '1', md: '5' }}
          disabled={isLoading}
          onValueChange={handleShaderChange}
          size='1'
          value={platformPreference.shader}
        >
          {shaders.map((shader) => (
            <div className='relative flex flex-col gap-1' key={shader.id}>
              <RadioCards.Item value={shader.id}>
                <span className={shader.id ? 'icon-[mdi--stars]' : 'icon-[mdi--do-not-disturb-alt]'} />
                <span className='font-semibold'>{shader.id ? shader.name : t('disabled')}</span>
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
                        {t('select {{name}}', { name: shader.name })}
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
  )
}
