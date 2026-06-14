import { ScrollArea } from '@radix-ui/themes'
import { attemptAsync } from 'es-toolkit'
import { useCallback, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { getFileUrl } from '#@/pages/library/utils/file.ts'
import { imageLoaded } from '#@/utils/client/image.ts'
import { getRomGoodcodes, getRomLibretroThumbnail } from '#@/utils/client/library.ts'
import { GameMediaDialog } from '../game-media-dialog/game-media-dialog.tsx'
import { isCbzFile, isImageFile, isPdfFile, isVideoFile } from '../game-media-dialog/utils.ts'
import { GameMediaCarousel, type MediaItem } from './game-media-carousel.tsx'
import { MediaThumbnail } from './media-thumbnail.tsx'
import { getYouTubeThumbnailUrl } from './youtube-utils.ts'

export function GameMedia() {
  const rom = useRom()

  const video = rom?.rawGameMetadata?.launchbox?.videoUrl
  const title = rom?.rawGameMetadata?.libretro ? getRomLibretroThumbnail(rom, 'title', 'libretro') : ''
  const snap = rom?.rawGameMetadata?.libretro ? getRomLibretroThumbnail(rom, 'snap', 'libretro') : ''

  const builtinImageUrls = [title, snap].filter(Boolean)
  const userMediaItems: MediaItem[] = rom.gameThumbnailFileIds
    ? rom.gameThumbnailFileIds.split(',').map((fileId): MediaItem => {
        const url = getFileUrl(fileId)
        if (isVideoFile(fileId)) {
          return { src: url, type: 'video' }
        }
        if (isImageFile(fileId)) {
          return { src: url, type: 'image' }
        }
        if (isCbzFile(fileId)) {
          return { src: url, type: 'cbz' }
        }
        if (isPdfFile(fileId)) {
          return { src: url, type: 'pdf' }
        }
        return { src: url, type: 'file' }
      })
    : []

  const { data: validBuiltinImages } = useSWRImmutable(builtinImageUrls, async (urls) => {
    const validatingImages = await Promise.all(
      urls.map(async (url) => {
        const [, result] = await attemptAsync(() => imageLoaded(url))
        return result
      }),
    )
    return validatingImages.filter((image): image is string => Boolean(image?.length))
  })

  const youtubeThumbnailUrl = video ? getYouTubeThumbnailUrl(video) : undefined
  const { data: youtubeThumbnailValid } = useSWRImmutable(youtubeThumbnailUrl, async (url) => {
    const [, result] = await attemptAsync(async () => {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    })
    return Boolean(result)
  })

  const [carouselOpen, setCarouselOpen] = useState(false)
  const [carouselInitialIndex, setCarouselInitialIndex] = useState(0)
  const [originRect, setOriginRect] = useState<DOMRect | null>(null)
  const thumbRefs = useRef(new Map<number, HTMLElement>())

  const mediaItems: MediaItem[] = []
  if (video && youtubeThumbnailValid) {
    mediaItems.push({ src: video, type: 'youtube' })
  }
  if (validBuiltinImages) {
    for (const image of validBuiltinImages) {
      mediaItems.push({ src: image, type: 'image' })
    }
  }
  for (const item of userMediaItems) {
    mediaItems.push(item)
  }
  const handleThumbnailClick = useCallback((index: number, event: React.MouseEvent<HTMLElement>) => {
    setOriginRect(event.currentTarget.getBoundingClientRect())
    setCarouselInitialIndex(index)
    setCarouselOpen(true)
  }, [])

  const handleSlideChange = useCallback((index: number) => {
    const el = thumbRefs.current?.get(index)
    if (el) {
      setOriginRect(el.getBoundingClientRect())
    }
  }, [])

  const handleClose = useCallback((_currentIndex: number) => {
    setCarouselOpen(false)
  }, [])

  if (!mediaItems.length) {
    return
  }

  return (
    <>
      <ScrollArea className='rounded lg:bg-zinc-600/10 lg:p-4' scrollbars='both' size='2'>
        <div className='group flex flex-col gap-4 lg:flex-row lg:p-0'>
          {mediaItems.map((item, index) => (
            <MediaThumbnail
              alt={getRomGoodcodes(rom).rom}
              index={index}
              item={item}
              key={item.src}
              onClick={handleThumbnailClick}
              thumbRefs={thumbRefs.current}
            />
          ))}
          <div className='flex items-center justify-end p-1.5 lg:w-auto'>
            <GameMediaDialog />
          </div>
        </div>
      </ScrollArea>
      <GameMediaCarousel
        initialIndex={carouselInitialIndex}
        items={mediaItems}
        onClose={handleClose}
        onSlideChange={handleSlideChange}
        open={carouselOpen}
        originRect={originRect}
      />
    </>
  )
}
