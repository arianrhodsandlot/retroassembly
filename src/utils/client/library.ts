import { parse } from 'goodcodes-parser'
import { Nostalgist } from 'nostalgist'
import { getCDNUrl } from '../isomorphic/cdn.ts'

export { getLibretroThumbnail, getRomLibretroThumbnail } from '../isomorphic/libretro-thumbnail.ts'

const { path } = Nostalgist.vendors

export function getDemoRomThumbnail(rom) {
  const platform = { genesis: 'md' }[rom.platform] || rom.platform
  const repo = `retrobrews/${platform}-games`
  // @ts-expect-error we know this is a valid call
  return getCDNUrl(repo, `${path.parse(rom.fileName).name}.png`)
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

export function getRomGoodcodes(rom: { fileName?: string; rawGameMetadata?: any; name?: string; platform?: string }) {
  let { name } = path.parse(rom?.fileName || '')

  if ('name' in rom) {
    name = rom.name ?? ''
  }

  if (rom.platform === 'arcade' && rom.rawGameMetadata?.libretro?.name) {
    name = rom.rawGameMetadata.libretro.name
  }
  return parse(`0 - ${name}`)
}

export function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}
