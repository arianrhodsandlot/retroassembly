import { Nostalgist } from 'nostalgist'

const { path } = Nostalgist.vendors

export function getYouTubeThumbnailUrl(url: string) {
  const id = extractYouTubeId(url)
  if (!id) {
    return
  }
  return `https://img.youtube.com/vi/${encodeURIComponent(id)}/mqdefault.jpg`
}

export function extractYouTubeId(url: string) {
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

export function convertYouTubeIframeURL(url: string) {
  const id = extractYouTubeId(url)
  if (!id) {
    return
  }

  const embedUrl = new URL(`/embed/${encodeURIComponent(id)}`, 'https://www.youtube.com')
  embedUrl.searchParams.set('enablejsapi', '1')
  return embedUrl.href
}
