import { twMerge } from 'tailwind-merge'
import { convertYouTubeIframeURL } from './youtube-utils.ts'

interface YouTubeEmbedProps {
  className: string
  url: string
}

export function YouTubeEmbed({ className, url }: Readonly<YouTubeEmbedProps>) {
  if (!url) {
    return
  }

  const src = convertYouTubeIframeURL(url)
  if (!src) {
    return
  }

  return (
    <iframe
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      className={twMerge('aspect-video max-w-full border-none bg-black', className)}
      referrerPolicy='strict-origin-when-cross-origin'
      sandbox='allow-same-origin allow-scripts allow-forms'
      src={src}
      title='YouTube video player'
    />
  )
}
