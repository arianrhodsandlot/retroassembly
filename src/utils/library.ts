import { capitalize } from 'es-toolkit'
import { parse } from 'goodcodes-parser'
import { Nostalgist } from 'nostalgist'
import type { Rom } from '@/controllers/get-roms.ts'
import { platformMap, type PlatformName } from '../constants/platform.ts'
import { getCDNUrl } from './cdn.ts'

type LibretroThumbnailType = 'boxart' | 'snap' | 'title'

const { path } = Nostalgist.vendors

export function getDemoRomThumbnail(rom) {
  const platform = { genesis: 'md' }[rom.platform] || rom.platform
  const repo = `retrobrews/${platform}-games`
  return getCDNUrl(repo, `${path.parse(rom.fileName).name}.png`)
}

export function getRomLibretroThumbnail(rom, type: LibretroThumbnailType = 'boxart') {
  const name = rom.libretroGame?.name
  if (!name || !rom.platform) {
    return ''
  }
  const platformFullName = platformMap[rom.platform].libretroName
  if (!platformFullName) {
    return ''
  }

  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const repo = path.join('libretro-thumbnails', normalizedPlatformFullName)

  const fileDirectory = `Named_${capitalize(type)}s`
  const normalizedFileName = `${name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')}.png`
  const filePath = path.join(fileDirectory, normalizedFileName)

  // @ts-expect-error assume repo is valid here
  return getCDNUrl(repo, filePath)
}

const esdeAlias = { sms: 'mastersystem', snes: 'snesna', vb: 'virtualboy' }

export function getPlatformIcon(platform: string) {
  return getCDNUrl('Weestuarty/lcars-es-de', `system/icons/${esdeAlias[platform] || platform}.png`)
}

export function getPlatformGameIcon(platform: string) {
  const platformFullName = platformMap[platform].libretroName
  if (!platformFullName) {
    return ''
  }
  const repo = 'batocera-linux/batocera-themes'
  const aliasMap: Partial<Record<PlatformName, string>> = {
    arcade: 'fba',
    atarilynx: 'lynx',
    famicom: 'nes',
    genesis: 'megadrive',
    sfc: 'snes',
    'sg-1000': 'sg1000',
    sms: 'mastersystem',
    vb: 'virtualboy',
  }
  const alias = aliasMap[platform]
  return getCDNUrl(repo, `themes/batocera/${alias || platform}/_data/svg/game.svg`)
}

const platformBannerMap = {
  ngp: { filePath: 'ngp/art/system.svg', repo: 'RetroPie/es-theme-carbon' },
  sfc: { filePath: 'themes/batocera/snes/_data/svg/logo.svg', repo: 'batocera-linux/batocera-themes' },
  wonderswan: { filePath: 'wonderswan/art/system.svg', repo: 'RetroPie/es-theme-carbon' },
}
export function getPlatformBanner(platform: string) {
  const repo = platformBannerMap[platform]?.repo || 'Weestuarty/lcars-es-de'
  const filePath =
    platformBannerMap[platform]?.filePath || `system/logos/system-logo-color/${esdeAlias[platform] || platform}.svg`
  return getCDNUrl(repo, filePath)
}

export function getPlatformDevicePhoto(platform: string) {
  return getCDNUrl('Weestuarty/codywheel-es-de', `assets/systemimages/${esdeAlias[platform] || platform}.png`)
}

export function getPlatformDeviceBackground(platform: string) {
  return getCDNUrl('Weestuarty/diamond-es-de', `assets/backgrounds/${esdeAlias[platform] || platform}.png`)
}

export function getRomGoodcodes(rom: Rom) {
  let { name } = path.parse(rom.fileName)
  if (rom.platform === 'arcade' && rom.libretroGame?.name) {
    name = rom.libretroGame.name
  }
  return parse(`0 - ${name}`)
}

export function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}
