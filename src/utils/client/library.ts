import { capitalize, trim } from 'es-toolkit'
import { parse } from 'goodcodes-parser'
import { Nostalgist } from 'nostalgist'
import { platformMap } from '../../constants/platform.ts'
import { getCDNUrl } from '../isomorphic/cdn.ts'

type LibretroThumbnailType = 'boxart' | 'logo' | 'snap' | 'title'

const { path } = Nostalgist.vendors

export function getDemoRomThumbnail(rom) {
  const platform = { genesis: 'md' }[rom.platform] || rom.platform
  const repo = `retrobrews/${platform}-games`
  return getCDNUrl(repo, `${path.parse(rom.fileName).name}.png`)
}

export function getLibretroThumbnail(name: string, platform: string, type: LibretroThumbnailType = 'boxart') {
  if (!name || !platform) {
    return ''
  }
  let platformFullName = platformMap[platform]?.libretroName || platform
  if (!platformFullName) {
    return ''
  }
  if (platformFullName.includes('MAME')) {
    platformFullName = 'MAME'
  }

  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const repo = path.join('libretro-thumbnails', trim(normalizedPlatformFullName, '+'))

  const fileDirectory = `Named_${capitalize(type)}s`
  const normalizedFileName = `${name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')}.png`
  const filePath = path.join(fileDirectory, normalizedFileName)

  return getCDNUrl(repo, filePath)
}

export function getRomLibretroThumbnail(
  rom: { libretroGame?: { name?: null | string; platform?: null | string } | null; platform?: string },
  type: LibretroThumbnailType = 'boxart',
) {
  const name = rom.libretroGame?.name
  if (!name || !rom.platform) {
    return ''
  }
  const platform = rom.libretroGame?.platform || platformMap[rom.platform].libretroName || rom.platform
  return getLibretroThumbnail(name, platform, type)
}

export function getPlatformIcon(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/icons/${platform}.png`)
}

export function getPlatformGameIcon(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/contents/${platform}.svg`)
}

export function getPlatformBanner(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/logos/${platform}.svg`)
}

export function getPlatformDevicePhoto(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/photos/${platform}.png`)
}

export function getPlatformDeviceBackground(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/backgrounds/${platform}.png`)
}

export function getPlatformBluredBackground(platform: string) {
  return getCDNUrl('arianrhodsandlot/retroassembly-assets', `platforms/blured-backgrounds/${platform}.jpg`)
}

export function getRomGoodcodes(rom: {
  fileName?: string
  libretroGame?: { name?: string }
  name?: string
  platform?: string
}) {
  let { name } = path.parse(rom?.fileName || '')

  if ('name' in rom) {
    name = rom.name as string
  }

  if (rom.platform === 'arcade' && rom.libretroGame?.name) {
    name = rom.libretroGame.name
  }
  return parse(`0 - ${name}`)
}

export function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}
