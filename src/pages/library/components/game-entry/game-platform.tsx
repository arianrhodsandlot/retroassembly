import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { platformMap } from '#@/constants/platform.ts'
import { getPlatformIcon } from '#@/utils/client/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'

export function GamePlatform({ platform }: Readonly<{ platform: string }>) {
  const { t } = useTranslation()
  const currentPlatform = usePlatform()

  if (currentPlatform) {
    return
  }

  return (
    <div className='mt-1 flex items-center justify-center gap-2 text-xs text-(--color-text)/40'>
      <img
        alt={t(platformMap[platform].displayName)}
        className={clsx('size-4', { invert: ['ngp', 'wonderswan'].includes(platformMap[platform].name) })}
        loading='lazy'
        src={getPlatformIcon(platformMap[platform].name)}
      />
      {t(platformMap[platform].displayName)}
    </div>
  )
}
