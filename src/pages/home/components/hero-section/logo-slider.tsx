import { clsx } from 'clsx'
import { noop, range } from 'es-toolkit'
import { useSyncExternalStore } from 'react'
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
  const hydrated = useSyncExternalStore(
    () => noop,
    () => true,
    () => false,
  )

  return (
    <div className='gap-(--gap) flex overflow-hidden [--gap:2.5rem]'>
      {range(hydrated ? 2 : 1).map((key) => (
        <div
          className={clsx('gap-(--gap) flex shrink-0', { 'animate-[marquee-left_20s_linear_infinite]': hydrated })}
          key={key}
        >
          {platforms.map((platform) => (
            <img
              alt={platformMap[platform].displayName}
              className='h-8 w-20 object-contain'
              key={platform}
              src={getPlatformBanner(platform)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
