import { useTranslation } from 'react-i18next'
import { platformMap } from '#@/constants/platform.ts'
import { getPlatformBanner, getPlatformDevicePhoto } from '#@/utils/client/library.ts'
import { useDate } from '../../hooks/use-date.ts'
import { CompanyLogo } from '../../platform/components/company-logo.tsx'
import { DeviceNotes } from './device-notes.tsx'

export function DeviceInfo({ platform }: Readonly<{ platform: string }>) {
  const { t } = useTranslation()
  const { formatDate, formatDateRelative, isValidDate } = useDate()

  const platformData = platformMap[platform]
  if (!platformData?.info) {
    return <h1 className='text-5xl font-semibold'>{t(platformData?.displayNameI18nKey || '')}</h1>
  }

  const { info } = platformData
  const banner = getPlatformBanner(platform)
  const devicePhoto = getPlatformDevicePhoto(platform)

  let { developer, manufacturer } = info
  if (platform === 'arcade') {
    developer = t('common.variousCompanies')
    manufacturer = t('common.variousCompanies')
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
      <div className='flex flex-1 flex-col gap-8'>
        <h1>
          <img alt={t(platformData.displayNameI18nKey)} className='h-16 w-auto lg:px-8' loading='lazy' src={banner} />
        </h1>

        <div className='rounded bg-(--gray-a3) p-4 lg:px-8'>
          <div className='flex flex-col gap-8 lg:flex-row lg:*:min-w-36'>
            <div>
              <div className='flex h-6 items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                <span>{t('common.released')}</span>
              </div>
              <div className='mt-1 pl-6'>
                {isValidDate(info.releaseDate) ? (
                  <>
                    {formatDate(info.releaseDate)}
                    <span className='ml-1.5 text-xs opacity-50'>{formatDateRelative(info.releaseDate)}</span>
                  </>
                ) : (
                  <span className='opacity-40'>{t('common.unknown')}</span>
                )}
              </div>
            </div>

            {manufacturer === developer ? (
              <div>
                <div className='flex h-6 items-center gap-2 font-semibold'>
                  <span className='icon-[mdi--factory]' />
                  <span>
                    {t('common.developer')} & {t('common.manufacturer')}
                  </span>
                </div>
                <div className='mt-1 pl-6'>
                  <CompanyLogo className='h-5' company={manufacturer || ''} fallback={manufacturer} />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span>{t('common.developer')}</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={developer || ''} fallback={developer} />
                  </div>
                </div>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span>{t('common.manufacturer')}</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={manufacturer || ''} fallback={manufacturer} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {info.notesI18nKey ? <DeviceNotes key={platform} notes={t(info.notesI18nKey)} /> : null}
      </div>

      <div className='hidden w-lg shrink-0 pt-20 lg:block'>
        <img
          alt={t(platformData.displayNameI18nKey)}
          className='motion-preset-oscillate motion-duration-2400 mx-auto aspect-video w-4/5 object-contain object-center drop-shadow-2xl [--motion-loop-translate-y:8px]'
          loading='lazy'
          src={devicePhoto}
        />
      </div>
    </div>
  )
}
