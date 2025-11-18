import { ScrollArea } from '@radix-ui/themes'
import { attemptAsync } from 'es-toolkit'
import useSWRImmutable from 'swr/immutable'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { getFileUrl } from '#@/pages/library/utils/file.ts'
import { imageLoaded } from '#@/utils/client/image.ts'
import { getRomGoodcodes, getRomLibretroThumbnail } from '#@/utils/client/library.ts'
import { GameMediaDialog } from '../game-media-dialog/game-media-dialog.tsx'
import { YouTubeEmbed } from './youtube-embed.tsx'

export function GameMedia() {
  const rom = useRom()

  const video = rom?.launchboxGame?.videoUrl
  const title = rom?.libretroGame ? getRomLibretroThumbnail(rom, 'title') : ''
  const snap = rom?.libretroGame ? getRomLibretroThumbnail(rom, 'snap') : ''

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

  if (!validImages?.length && !video) {
    return
  }

  if (video || title || snap) {
    return (
      <ScrollArea className='rounded lg:bg-zinc-600/10 lg:p-4' scrollbars='both' size='2'>
        <div className='group flex flex-col gap-4 lg:flex-row lg:p-0'>
          {video ? (
            <div className='w-full lg:w-auto lg:min-w-0 lg:shrink-0'>
              <YouTubeEmbed className='h-auto w-full shrink-0 lg:h-48 lg:w-auto' url={video} />
            </div>
          ) : null}
          {validImages?.map((image) => (
            <a className='shrink-0 empty:hidden' href={image} key={image} rel='noreferrer noopener' target='_blank'>
              <img
                alt={getRomGoodcodes(rom).rom}
                className='h-auto w-full lg:h-48 lg:w-auto'
                key={image}
                loading='lazy'
                src={image}
              />
            </a>
          ))}
          <div className='flex items-center justify-end p-1.5 lg:w-auto'>
            <GameMediaDialog />
          </div>
        </div>
      </ScrollArea>
    )
  }
}
