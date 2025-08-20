import useSWRImmutable from 'swr/immutable'
import type { Rom } from '@/controllers/get-roms'
import { getDemoRomThumbnail, getPlatformGameIcon, getRomLibretroThumbnail } from '@/utils/library.ts'
import { getFileUrl } from '../utils/file.ts'
import { useIsDemo } from './use-demo.ts'

const validImages = new Set<string>([])
const invalidImages = new Set<string>([])

function imageLoaded(src: string) {
  const img = new Image()
  img.src = src
  return new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => resolve())
    img.addEventListener('error', (error) => reject(error))
  })
}

const libretroThumbnailTypes = ['boxart', 'title', 'snap'] as const
export function useRomCover(rom: Rom) {
  const isDemo = useIsDemo()
  const romCovers = isDemo
    ? [getDemoRomThumbnail(rom)]
    : libretroThumbnailTypes.map((type) => getRomLibretroThumbnail(rom, type))

  if (rom.gameBoxartFileIds) {
    romCovers.unshift(...rom.gameBoxartFileIds.split(',').map((fileId) => getFileUrl(fileId)))
  }
  const platformCover = getPlatformGameIcon(rom.platform)
  const covers = [...romCovers, platformCover]

  return useSWRImmutable(covers, async () => {
    for (const romCover of romCovers) {
      if (romCover && !invalidImages.has(romCover)) {
        if (validImages.has(romCover)) {
          return { src: romCover, type: 'rom' }
        }

        try {
          await imageLoaded(romCover)
          validImages.add(romCover)
          return { src: romCover, type: 'rom' }
        } catch {
          invalidImages.add(romCover)
        }
      }
    }
    validImages.add(platformCover)
    return { src: platformCover, type: 'platform' }
  })
}
