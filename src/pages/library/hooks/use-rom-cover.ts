import { uniq } from 'es-toolkit'
import useSWRImmutable from 'swr/immutable'
import type { Rom } from '@/controllers/get-roms'
import { imageLoaded } from '@/utils/image.ts'
import {
  getDemoRomThumbnail,
  getLibretroThumbnail,
  getPlatformGameIcon,
  getRomLibretroThumbnail,
} from '@/utils/library.ts'
import { getFileUrl } from '../utils/file.ts'
import { useIsDemo } from './use-demo.ts'

const libretroThumbnailTypes = ['boxart', 'title', 'snap'] as const
export function useRomCover(rom: Rom) {
  const isDemo = useIsDemo()
  const romCovers = isDemo
    ? [getDemoRomThumbnail(rom)]
    : [
        ...libretroThumbnailTypes.map((type) => getRomLibretroThumbnail(rom, type)),
        ...libretroThumbnailTypes.map((type) => getLibretroThumbnail(rom.fileName.split('.')[0], rom.platform, type)),
      ]
  if (rom.gameBoxartFileIds) {
    romCovers.unshift(...rom.gameBoxartFileIds.split(',').map((fileId) => getFileUrl(fileId)))
  }
  const uniqueRomCovers = uniq(romCovers).filter(Boolean)
  const platformCover = getPlatformGameIcon(rom.platform)
  const covers = [...uniqueRomCovers, platformCover]

  return useSWRImmutable(covers, async () => {
    for (const romCover of uniqueRomCovers) {
      try {
        await imageLoaded(romCover)
        return { src: romCover, type: 'rom' }
      } catch {}
    }
    return { src: platformCover, type: 'platform' }
  })
}
