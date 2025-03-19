import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { CompanyLogo } from '../platform/components/company-logo.tsx'
import { DeviceNotes } from './device-notes.tsx'

const platformImageMap = {
  arcade: { logoFilePath: 'arcade/art/system.svg', logoRepo: 'RetroPie/es-theme-carbon' },
  atarilynx: { logoFilePath: 'themes/batocera/lynx/_data/svg/logo.svg' },
  megadrive: { logoFilePath: 'genesis/art/system.svg', logoRepo: 'RetroPie/es-theme-carbon' },
  'sg-1000': { logoFilePath: 'themes/batocera/sg1000/_data/svg/logo.svg' },
  sms: {
    devicePhotoFilePath: 'systems/device/mastersystem.png',
    logoFilePath: 'themes/batocera/mastersystem/_data/svg/logo.svg',
  },
  vb: {
    devicePhotoFilePath: 'systems/device/virtualboy.png',
    logoFilePath: 'themes/batocera/virtualboy/_data/svg/logo.svg',
  },
}

export async function DeviceInfo({ platform }: { platform: string }) {
  const platformInfo = await getPlatformInfo(platform)
  if (!platformInfo) {
    return
  }

  const logoRepo = platformImageMap[platform]?.logoRepo || 'batocera-linux/batocera-themes'
  const logoFilePath = platformImageMap[platform]?.logoFilePath || `themes/batocera/${platform}/_data/svg/logo.svg`
  const logo = getCDNUrl(logoRepo, logoFilePath)
  const devicePhotoFilePath = platformImageMap[platform]?.devicePhotoFilePath || `systems/device/${platform}.png`
  const devicePhoto = getCDNUrl('Mattersons/es-theme-neutral', devicePhotoFilePath)

  return (
    <div className='flex'>
      <div className='flex flex-col gap-8 px-4'>
        <h1>
          <img alt={platformInfo.name} className='h-20 w-auto px-8 pt-4' src={logo} />
        </h1>

        <div className='rounded bg-zinc-600/10 px-8 py-4'>
          <div className='flex gap-8 *:min-w-36'>
            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                Released
              </div>
              <div className='mt-1 pl-6'>{platformInfo.release_date?.toLocaleDateString() || 'unknown'}</div>
            </div>

            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--factory]' />
                Manufacturer
              </div>
              <div className='mt-1 pl-6'>
                <CompanyLogo
                  className='h-5'
                  company={platformInfo.manufacturer || ''}
                  fallback={platformInfo.developer || 'unknown'}
                />
              </div>
            </div>
          </div>
        </div>
        {platformInfo.notes ? <DeviceNotes key={platform} notes={platformInfo.notes} /> : null}
      </div>

      <div className='w-lg shrink-0'>
        <img
          alt={platformInfo.name}
          className='motion-preset-oscillate motion-duration-2400 h-auto w-full drop-shadow-2xl [--motion-loop-translate-y:8px]'
          src={devicePhoto}
        />
      </div>
    </div>
  )
}
