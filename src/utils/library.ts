import { capitalize } from 'es-toolkit'
import { parse } from 'goodcodes-parser'
import { Nostalgist } from 'nostalgist'
import type { Rom } from '@/controllers/get-roms.ts'
import { platformMap } from '../constants/platform.ts'
import { getCDNUrl } from './cdn.ts'

type LibretroThumbnailType = 'boxart' | 'snap' | 'title'

const { path } = Nostalgist.vendors

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
  const alias = { arcade: 'fba', atarilynx: 'lynx', 'sg-1000': 'sg1000', sms: 'mastersystem', vb: 'virtualboy' }[
    platform
  ]
  return getCDNUrl(repo, `themes/batocera/${alias || platform}/_data/svg/game.svg`)
}

const platformBannerMap = {
  arcade: { filePath: 'arcade/art/system.svg', repo: 'RetroPie/es-theme-carbon' },
  atarilynx: { filePath: 'themes/batocera/lynx/_data/svg/logo.svg' },
  megadrive: { filePath: 'genesis/art/system.svg', repo: 'RetroPie/es-theme-carbon' },
  'sg-1000': { alias: 'sg1000' },
  sms: { alias: 'mastersystem' },
  vb: { alias: 'virtualboy' },
}
export function getPlatformBanner(platform: string) {
  const alias = platformBannerMap[platform]?.alias
  const repo = platformBannerMap[platform]?.repo || 'batocera-linux/batocera-themes'
  const filePath = platformBannerMap[platform]?.filePath || `themes/batocera/${alias || platform}/_data/svg/logo.svg`
  const url = getCDNUrl(repo, filePath)
  return url
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
