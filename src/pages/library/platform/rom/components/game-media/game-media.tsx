import { ScrollArea } from '@radix-ui/themes'
import { attemptAsync } from 'es-toolkit'
import { useCallback, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { getFileUrl } from '#@/pages/library/utils/file.ts'
import { imageLoaded } from '#@/utils/client/image.ts'
import { getRomGoodcodes, getRomLibretroThumbnail } from '#@/utils/client/library.ts'
import { GameMediaDialog } from '../game-media-dialog/game-media-dialog.tsx'
import { GameMediaCarousel, type MediaItem } from './game-media-carousel.tsx'
import { YouTubeEmbed } from './youtube-embed.tsx'

export function GameMedia() {
  const rom = useRom()

  const video = rom?.rawGameMetadata?.launchbox?.videoUrl
  const title = rom?.rawGameMetadata?.libretro ? getRomLibretroThumbnail(rom, 'title', 'libretro') : ''
  const snap = rom?.rawGameMetadata?.libretro ? getRomLibretroThumbnail(rom, 'snap', 'libretro') : ''

  const images = [title, snap]
  if (rom.gameThumbnailFileIds) {
    images.push(...rom.gameThumbnailFileIds.split(',').map((fileId) => getFileUrl(fileId)))
  }

  const { data: validImages } = useSWRImmutable(images, async (images) => {
    const validatingImages = await Promise.all(
      images.map(async (image) => {
        const [, result] = await attemptAsync(() => imageLoaded(image))
        return result
      }),
    )
    const validImages = validatingImages.filter((image): image is string => Boolean(image?.length))
    return validImages
  })

  const [carouselOpen, setCarouselOpen] = useState(false)
  const [carouselInitialIndex, setCarouselInitialIndex] = useState(0)
  const [originRect, setOriginRect] = useState<DOMRect | null>(null)
  const thumbRefs = useRef<Map<number, HTMLElement>>(null)
  if (!thumbRefs.current) {
    thumbRefs.current = new Map()
  }

  const mediaItems: MediaItem[] = []
  if (video) {
    mediaItems.push({ src: video, type: 'video' })
  }
  if (validImages) {
    for (const image of validImages) {
      mediaItems.push({ src: image, type: 'image' })
    }
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
          {video ? (
            <button
              className='w-full cursor-pointer border-none bg-transparent p-0 lg:w-auto lg:min-w-0 lg:shrink-0'
              onClick={(e) => handleThumbnailClick(0, e)}
              ref={(el) => {
                if (el) {
                  thumbRefs.current?.set(0, el)
                }
              }}
              type='button'
            >
              <YouTubeEmbed className='pointer-events-none h-auto w-full shrink-0 lg:h-48 lg:w-auto' url={video} />
            </button>
          ) : null}
          {validImages?.map((image, i) => (
            <button
              className='shrink-0 cursor-pointer border-none bg-transparent p-0 empty:hidden'
              key={image}
              onClick={(e) => handleThumbnailClick((video ? 1 : 0) + i, e)}
              ref={(el) => {
                if (el) {
                  thumbRefs.current?.set((video ? 1 : 0) + i, el)
                }
              }}
              type='button'
            >
              <img
                alt={getRomGoodcodes(rom).rom}
                className='pointer-events-none h-auto w-full lg:h-48 lg:w-auto'
                loading='lazy'
                src={image}
              />
            </button>
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
