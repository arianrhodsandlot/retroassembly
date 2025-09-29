import { useLoaderData } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import { getCDNUrl } from '@/utils/isomorphic/cdn.ts'
import { MainBackground } from '../../components/main-background.tsx'

export function PlatformBackground() {
  const { platform } = useLoaderData()
  const platformName =
    {
      famicom: 'nes',
      sms: 'mastersystem',
      vb: 'virtualboy',
    }[platform] || platform
  const imageName =
    {
      atari2600: 'a2600',
      atari5200: 'a5200',
      atari7800: 'a7800',
      atarilynx: 'lynx',
      colecovision: 'col',
      famicom: 'nes',
      gamegear: 'gg',
      genesis: 'gen',
      sega32x: '32x',
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
