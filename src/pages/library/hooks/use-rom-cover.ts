import useSWRImmutable from 'swr/immutable'
import type { Rom } from '@/controllers/get-roms'
import { getPlatformGameIcon, getRomLibretroThumbnail } from '@/utils/library.ts'

const validImages = new Set<string>([])
const invalidImages = new Set<string>([])

function imageLoaded(src) {
  const img = new Image()
  img.src = src
  return new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => resolve())
    img.addEventListener('error', (error) => reject(error))
  })
}

export function useRomCover(rom: Rom) {
  const romCover = getRomLibretroThumbnail(rom)
  const platformCover = getPlatformGameIcon(rom.platform)

  return useSWRImmutable([romCover, platformCover], async () => {
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
    validImages.add(platformCover)
    return { src: platformCover, type: 'platform' }
  })
}
