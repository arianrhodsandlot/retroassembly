import { platformMap } from '@/constants/platform.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { MainBackground } from '../../components/main-background.tsx'

export function PlatformBackground({ platform }: { platform: string }) {
  const platformName =
    {
      famicom: 'nes',
      sms: 'mastersystem',
      vb: 'virtualboy',
    }[platform] || platform
  const imageName =
    {
      atari2600: 'a2600',
      famicom: 'nes',
      gamegear: 'gg',
      genesis: 'gen',
      vb: 'virtualboy',
    }[platform] || platform
  const platformBackgroundUrl = getCDNUrl(
    'HerbFargus/es-theme-tronkyfran',
    `${platformName}/art/${imageName}_art_blur.jpg`,
  )
  return (
    <MainBackground alt={platformMap[platform].displayName} key={platformBackgroundUrl} src={platformBackgroundUrl} />
  )
}
