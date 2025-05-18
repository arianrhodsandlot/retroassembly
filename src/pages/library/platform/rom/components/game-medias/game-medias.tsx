import { ScrollArea } from '@radix-ui/themes'
import { useState } from 'react'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { getRomLibretroThumbnail } from '@/utils/library.ts'
import { YouTubeEmbed } from './youtube-embed.tsx'

export function GameMedias() {
  const rom = useRom()

  const video = rom?.launchboxGame?.videoUrl
  const title = rom?.libretroGame ? getRomLibretroThumbnail(rom, 'title') : ''
  const snap = rom?.libretroGame ? getRomLibretroThumbnail(rom, 'snap') : ''
  const [invalidMedias, setInvalidMedias] = useState<string[]>([])

  const images = [title, snap].filter((media) => !invalidMedias.includes(media))

  if (!rom) {
    return
  }

  if (images.length === 0 && !video) {
    return
  }

  if (video || title || snap) {
    return (
      <ScrollArea className='rounded lg:bg-zinc-600/10 lg:p-4' scrollbars='both' size='2'>
        <div className='flex flex-col gap-4 lg:flex-row lg:p-0'>
          {video ? <YouTubeEmbed className='h-48' url={video} /> : null}
          {images.map((image) => (
            <a href={image} key={image} rel='noreferrer noopener' target='_blank'>
              <img
                alt={rom.goodcodes.rom}
                className='h-auto w-full lg:h-48 lg:w-auto'
                loading='lazy'
                onError={() => setInvalidMedias((medias) => [...medias, image])}
                src={image}
              />
            </a>
          ))}
        </div>
      </ScrollArea>
    )
  }
}
