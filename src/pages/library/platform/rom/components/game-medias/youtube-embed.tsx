import { Nostalgist } from 'nostalgist'
import { twMerge } from 'tailwind-merge'

const { path } = Nostalgist.vendors

function extractYouTubeId(url: string) {
  let urlObject: URL
  try {
    urlObject = new URL(url)
  } catch {
    return
  }

  // support for urls like "https://youtu.be/YGIRK1FFwj0"
  if (urlObject.hostname === 'youtu.be') {
    return path.basename(urlObject.pathname)
  }

  if (['www.youtube.com', 'youtube.com'].includes(urlObject.hostname)) {
    // support for urls like "https://www.youtube.com/watch?v=hY8Jpk-xSrQ"
    if (urlObject.pathname === '/watch') {
      return urlObject.searchParams.get('v')
    }

    // support for urls like "http://www.youtube.com/v/KfC0SNm0I9w"
    if (urlObject.pathname.startsWith('/v/')) {
      return path.basename(urlObject.pathname)
    }
  }
}

function convertYouTubeIframeURL(url: string) {
  const id = extractYouTubeId(url)
  if (!id) {
    return
  }

  const { href } = new URL(`/embed/${encodeURIComponent(id)}`, 'https://www.youtube.com')
  return href
}

interface YouTubeEmbedProps {
  className: string
  url: string
}

export function YouTubeEmbed({ className, url }: YouTubeEmbedProps) {
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
      className={twMerge('aspect-video border-none bg-black', className)}
      referrerPolicy='strict-origin-when-cross-origin'
      sandbox='allow-same-origin allow-scripts allow-forms' // eslint-disable-line @eslint-react/dom/no-unsafe-iframe-sandbox
      src={src}
      title='YouTube video player'
    />
  )
}
