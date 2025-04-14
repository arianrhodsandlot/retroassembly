import useSWRImmutable from 'swr/immutable'
import type { Rom } from '@/controllers/get-roms'
import { getDemoRomThumbnail, getPlatformGameIcon, getRomLibretroThumbnail } from '@/utils/library.ts'
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

export function useRomCover(rom: Rom) {
  const isDemo = useIsDemo()
  const romCover = isDemo ? getDemoRomThumbnail(rom) : getRomLibretroThumbnail(rom)
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
