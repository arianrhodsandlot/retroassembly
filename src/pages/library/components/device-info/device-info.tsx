import { useTranslation } from 'react-i18next'
import type { PlatformInfo } from '#@/controllers/roms/get-platform-info.ts'
import { getPlatformBanner, getPlatformDevicePhoto } from '#@/utils/client/library.ts'
import { useDate } from '../../hooks/use-date.ts'
import { CompanyLogo } from '../../platform/components/company-logo.tsx'
import { DeviceNotes } from './device-notes.tsx'

export function DeviceInfo({ platform, platformInfo }: Readonly<{ platform: string; platformInfo?: PlatformInfo }>) {
  const { t } = useTranslation()
  const { formatDate, formatDateRelative, isValidDate } = useDate()

  if (!platformInfo) {
    return
  }

  const banner = getPlatformBanner(platform)
  const devicePhoto = getPlatformDevicePhoto(platform)

  let { developer, manufacturer } = platformInfo
  if (platform === 'arcade') {
    developer = 'Various companies'
    manufacturer = 'Various companies'
  }

  if (developer?.toLowerCase().includes('nintendo')) {
    developer = 'Nintendo'
  }
  if (manufacturer?.toLowerCase().includes('nintendo')) {
    manufacturer = 'Nintendo'
  }

  if (developer?.toLowerCase().includes('atari')) {
    developer = 'Atari'
  }
  if (manufacturer?.toLowerCase().includes('atari')) {
    manufacturer = 'Atari'
  }

  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='flex flex-col gap-8'>
        <h1>
          <img alt={platformInfo.name} className='h-16 w-auto lg:px-8' loading='lazy' src={banner} />
        </h1>

        <div className='bg-(--gray-a3) rounded p-4 lg:px-8'>
          <div className='flex flex-col gap-8 lg:flex-row lg:*:min-w-36'>
            <div>
              <div className='flex h-6 items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                <span>{t('Released')}</span>
              </div>
              <div className='mt-1 pl-6'>
                {isValidDate(platformInfo.releaseDate) ? (
                  <>
                    {formatDate(platformInfo.releaseDate)}
                    <span className='ml-1.5 text-xs opacity-50'>{formatDateRelative(platformInfo.releaseDate)}</span>
                  </>
                ) : (
                  <span className='opacity-40'>{t('Unknown')}</span>
                )}
              </div>
            </div>

            {manufacturer === developer ? (
              <div>
                <div className='flex h-6 items-center gap-2 font-semibold'>
                  <span className='icon-[mdi--factory]' />
                  <span>
                    {t('Developer')} & {t('Manufacturer')}
                  </span>
                </div>
                <div className='mt-1 pl-6'>
                  <CompanyLogo className='h-5' company={manufacturer || ''} fallback={t(manufacturer)} />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span>{t('Developer')}</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={developer || ''} fallback={t(developer)} />
                  </div>
                </div>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span>{t('Manufacturer')}</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={manufacturer || ''} fallback={t(manufacturer)} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {platformInfo.notes ? <DeviceNotes key={platform} notes={platformInfo.notes} /> : null}
      </div>

      <div className='w-lg hidden shrink-0 pt-20 lg:block'>
        <img
          alt={platformInfo.name}
          className='motion-preset-oscillate motion-duration-2400 mx-auto aspect-video w-4/5 object-contain object-center drop-shadow-2xl [--motion-loop-translate-y:8px]'
          loading='lazy'
          src={devicePhoto}
        />
      </div>
    </div>
  )
}
