import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getPlatformBanner, getPlatformDevicePhoto } from '@/utils/library.ts'
import { CompanyLogo } from '../../platform/components/company-logo.tsx'
import { DeviceNotes } from './device-notes.tsx'

export async function DeviceInfo({ platform }: { platform: string }) {
  const platformInfo = await getPlatformInfo(platform)
  if (!platformInfo) {
    return
  }

  const banner = getPlatformBanner(platform)
  const devicePhoto = getPlatformDevicePhoto(platform)

  return (
    <div className='flex'>
      <div className='flex flex-col gap-8 px-4'>
        <h1>
          <img alt={platformInfo.name} className='h-20 w-auto px-8 pt-4' src={banner} />
        </h1>

        <div className='rounded bg-zinc-600/10 px-8 py-4'>
          <div className='flex gap-8 *:min-w-36'>
            <div>
              <div className='flex h-6 items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                <span className='text-xs'>Released</span>
              </div>
              <div className='mt-1 pl-6'>{platformInfo.releaseDate?.toLocaleDateString() || 'unknown'}</div>
            </div>

            {platformInfo.manufacturer === platformInfo.developer ? (
              <div>
                <div className='flex h-6 items-center gap-2 font-semibold'>
                  <span className='icon-[mdi--factory]' />
                  <span className='text-xs'>Developer & Manufacturer</span>
                </div>
                <div className='mt-1 pl-6'>
                  <CompanyLogo
                    className='h-5'
                    company={platformInfo.manufacturer || ''}
                    fallback={platformInfo.manufacturer || 'unknown'}
                  />
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
                    <CompanyLogo
                      className='h-5'
                      company={platformInfo.developer || ''}
                      fallback={platformInfo.developer || 'unknown'}
                    />
                  </div>
                </div>
                <div>
                  <div className='flex h-6 items-center gap-2 font-semibold'>
                    <span className='icon-[mdi--factory]' />
                    <span className='text-xs'>Manufacturer</span>
                  </div>
                  <div className='mt-1 pl-6'>
                    <CompanyLogo
                      className='h-5'
                      company={platformInfo.manufacturer || ''}
                      fallback={platformInfo.manufacturer || 'unknown'}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {platformInfo.notes ? <DeviceNotes key={platform} notes={platformInfo.notes} /> : null}
      </div>

      <div className='w-lg shrink-0 pt-20'>
        <img
          alt={platformInfo.name}
          className='motion-preset-oscillate motion-duration-2400 mx-auto aspect-video w-4/5 object-contain object-center drop-shadow-2xl [--motion-loop-translate-y:8px]'
          src={devicePhoto}
        />
      </div>
    </div>
  )
}
