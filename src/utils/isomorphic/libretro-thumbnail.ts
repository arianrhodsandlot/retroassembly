import { capitalize, trim } from 'es-toolkit'
import { platformMap } from '#@/constants/platform.ts'
import { getCDNUrl, libretroThumbnailsHost, toCDNCacheUrl } from './cdn.ts'

export type LibretroThumbnailType = 'boxart' | 'logo' | 'snap' | 'title'

export function getLibretroThumbnail({
  host = 'jsdelivr',
  platform,
  name,
  type = 'boxart',
}: {
  host?: 'jsdelivr' | 'libretro'
  name: string
  platform: string
  type?: LibretroThumbnailType
}) {
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
  const repo = `libretro-thumbnails/${trim(normalizedPlatformFullName, '+')}`

  const fileDirectory = `Named_${capitalize(type)}s`
  const normalizedFileName = `${name.replaceAll(/[&*/:`<>?\\]|\|"/gu, '_')}.png`
  const filePath = `${fileDirectory}/${normalizedFileName}`

  if (host === 'jsdelivr') {
    // @ts-expect-error we know this is a valid call
    return getCDNUrl(repo, filePath)
  }

  const result = new URL([platformFullName, fileDirectory, normalizedFileName].join('/'), libretroThumbnailsHost).href

  return toCDNCacheUrl(result)
}

export function getRomLibretroThumbnail(
  rom: {
    platform?: string
    rawGameMetadata?: {
      libretro?: { name?: null | string; platform?: null | string } | null
    } | null
  },
  type: LibretroThumbnailType = 'boxart',
  host: 'jsdelivr' | 'libretro' = 'libretro',
) {
  const libretroGame = rom.rawGameMetadata?.libretro
  const name = libretroGame?.name
  if (!name || !rom.platform) {
    return ''
  }
  const platform = libretroGame?.platform || platformMap[rom.platform].libretroName || rom.platform
  return getLibretroThumbnail({ host, name, platform, type })
}
