import { clsx } from 'clsx'
import { noop, range } from 'es-toolkit'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { platformMap } from '#@/constants/platform.ts'
import { getPlatformBanner } from '#@/utils/client/library.ts'

const platforms = [
  'atari2600',
  'nes',
  'famicom',
  'snes',
  'genesis',
  'megadrive',
  'sg-1000',
  'arcade',
  'gb',
  'gbc',
  'gba',
  'vb',
  'gamegear',
  'ngp',
  'wonderswan',
] as const

export function LogoSlider() {
  const { t } = useTranslation()

  const hydrated = useSyncExternalStore(
    () => noop,
    () => true,
    () => false,
  )

  return (
    <div className='relative flex gap-(--gap) overflow-hidden [--gap:2.5rem]'>
      {range(hydrated ? 2 : 1).map((key) => (
        <div
          className={clsx('flex shrink-0 gap-(--gap)', { 'animate-[marquee-left_50s_linear_infinite]': hydrated })}
          key={key}
        >
          {platforms.map((platform) => (
            <img
              alt={t(platformMap[platform].displayName)}
              className='h-8 w-20 object-contain'
              key={platform}
              src={getPlatformBanner(platform)}
              title={t(platformMap[platform].displayName)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
