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

export function getPlatformIcon(platform: string, type = 'content', directory = 'xmb/systematic/png') {
  const platformFullName = platformMap[platform].libretroName
  if (!platformFullName) {
    return ''
  }
  const repo = 'libretro/retroarch-assets'
  const fileName = type === 'content' ? `${platformFullName}-content.png` : `${platformFullName}.png`
  const filePath = path.join(directory, fileName)
  return getCDNUrl(repo, filePath)
}

export function getPlatformGameIcon(platform: string, type = 'game') {
  const platformFullName = platformMap[platform].libretroName
  if (!platformFullName) {
    return ''
  }
  // todo: move to constants
  const repo = 'batocera-linux/batocera-themes'
  const platformAlias =
    { arcade: 'fba', atarilynx: 'lynx', 'sg-1000': 'sg1000', sms: 'mastersystem', vb: 'virtualboy' }[platform] ||
    platform
  return getCDNUrl(repo, `themes/batocera/${platformAlias}/_data/svg/${type}.svg`)
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
