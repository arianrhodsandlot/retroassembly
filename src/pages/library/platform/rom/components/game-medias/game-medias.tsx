import { useState } from 'react'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
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
      <ScrollArea className='rounded bg-zinc-600/10 p-4' scrollbars='both' size='2'>
        <div className='flex gap-4'>
          {video ? <YouTubeEmbed className='h-48' url={video} /> : null}
          {images.map((image) => (
            <img
              alt={rom.goodcodes.rom}
              className='h-48 w-auto'
              key={image}
              loading='lazy'
              onError={() => setInvalidMedias((medias) => [...medias, image])}
              src={image}
            />
          ))}
        </div>
      </ScrollArea>
    )
  }
}
