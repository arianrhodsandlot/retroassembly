import { clsx } from 'clsx'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'

export function GamePlatform({ platform }: { platform: string }) {
  const currentPlatform = usePlatform()

  if (currentPlatform) {
    return
  }

  return (
    <div className='mt-1 flex items-center justify-center gap-2 text-xs text-black/40'>
      <img
        alt={platformMap[platform].displayName}
        className={clsx('size-4', { invert: ['ngp', 'wonderswan'].includes(platformMap[platform].name) })}
        src={getPlatformIcon(platformMap[platform].name)}
      />
      {platformMap[platform].displayName}
    </div>
  )
}
