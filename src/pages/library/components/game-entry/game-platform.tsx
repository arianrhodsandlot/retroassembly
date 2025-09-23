import { clsx } from 'clsx'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'

export function GamePlatform({ platform }: Readonly<{ platform: string }>) {
  const currentPlatform = usePlatform()

  if (currentPlatform) {
    return
  }

  return (
    <div className='text-(--color-text)/40 mt-1 flex items-center justify-center gap-2 text-xs'>
      <img
        alt={platformMap[platform].displayName}
        className={clsx('size-4', { invert: ['ngp', 'wonderswan'].includes(platformMap[platform].name) })}
        loading='lazy'
        src={getPlatformIcon(platformMap[platform].name)}
      />
      {platformMap[platform].displayName}
    </div>
  )
}
