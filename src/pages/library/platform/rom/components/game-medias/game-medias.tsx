'use client'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { getRomLibretroThumbnail } from '@/utils/library.ts'
import { GameImage } from './game-image.tsx'
import { YouTubeEmbed } from './youtube-embed.tsx'

export function GameMedias({ rom, video }) {
  const title = getRomLibretroThumbnail(rom, 'title')
  const snap = getRomLibretroThumbnail(rom, 'snap')

  return (
    <ScrollArea className='rounded bg-zinc-600/10 p-4' scrollbars='both' size='2'>
      <div className='flex gap-4'>
        <YouTubeEmbed className='h-48' url={video} />
        <GameImage alt={rom.displayName} src={title} />
        <GameImage alt={rom.displayName} src={snap} />
      </div>
    </ScrollArea>
  )
}
