import { DateTime } from 'luxon'
import type { PlatformInfo } from '@/controllers/get-platform-info.ts'
import { getPlatformBanner, getPlatformDevicePhoto } from '@/utils/library.ts'
import { CompanyLogo } from '../../platform/components/company-logo.tsx'
import { DeviceNotes } from './device-notes.tsx'

const unknown = <span className='opacity-40'>Unknown</span>

export function DeviceInfo({ platform, platformInfo }: Readonly<{ platform: string; platformInfo?: PlatformInfo }>) {
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

  const releaseDateTime = DateTime.fromISO(platformInfo.releaseDate)
  const relativeReleaseDate = releaseDateTime.isValid ? releaseDateTime.toRelative({ locale: 'en' }) : null

  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='flex flex-col gap-8'>
        <h1>
          <img alt={platformInfo.name} className='h-16 w-auto lg:px-8' src={banner} />
        </h1>

        <div className='bg-(--gray-a3) rounded p-4 lg:px-8'>
          <div className='flex flex-col gap-8 lg:flex-row lg:*:min-w-36'>
            <div>
              <div className='flex h-6 items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                <span className='text-xs'>Released</span>
              </div>
              <div className='mt-1 pl-6'>
                {releaseDateTime.isValid ? (
                  <>
                    {releaseDateTime.toISODate()}
                    <span className='ml-1.5 text-xs opacity-50'>{relativeReleaseDate}</span>
                  </>
                ) : (
                  unknown
                )}
              </div>
            </div>

            {manufacturer === developer ? (
              <div>
                <div className='flex h-6 items-center gap-2 font-semibold'>
                  <span className='icon-[mdi--factory]' />
                  <span className='text-xs'>Developer & Manufacturer</span>
                </div>
                <div className='mt-1 pl-6'>
                  <CompanyLogo className='h-5' company={manufacturer || ''} fallback={manufacturer || 'unknown'} />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span className='text-xs'>Developer</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={developer || ''} fallback={developer || 'unknown'} />
                  </div>
                </div>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span className='text-xs'>Manufacturer</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo className='h-5' company={manufacturer || ''} fallback={manufacturer || 'unknown'} />
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
          src={devicePhoto}
        />
      </div>
    </div>
  )
}
