import ky from 'ky'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
import { getRomLibretroThumbnail } from '@/utils/rom.ts'
import { YouTubeEmbed } from './youtube-embed.tsx'

async function checkImage(url: string) {
  try {
    await ky.head(url)
    return true
  } catch {}
  return false
}

export async function GameMedias({ rom, video }) {
  const title = getRomLibretroThumbnail(rom, 'title')
  const snap = getRomLibretroThumbnail(rom, 'snap')

  const [hasTitle, hasSnap] = await Promise.all([checkImage(title), checkImage(snap)])
  if (!video && !hasTitle && !hasSnap) {
    return
  }

  return (
    <ScrollArea className='rounded bg-zinc-600/10 p-4' scrollbars='both' size='2'>
      <div className='flex gap-4'>
        {video ? <YouTubeEmbed className='h-48' url={video} /> : null}
        {hasTitle ? <img alt={title} className='h-48 w-auto' src={title} /> : null}
        {hasSnap ? <img alt={snap} className='h-48 w-auto' src={snap} /> : null}
      </div>
    </ScrollArea>
  )
}
