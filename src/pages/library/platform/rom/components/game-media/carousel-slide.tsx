import { getFileExtension } from '../game-media-dialog/utils.ts'
import { CbzViewer } from './cbz-viewer.tsx'
import type { MediaItem } from './game-media-carousel.tsx'
import { convertYouTubeIframeURL } from './youtube-utils.ts'

interface CarouselSlideProps {
  index: number
  item: MediaItem
  videoRefs: Map<number, HTMLVideoElement>
  youtubeRefs: Map<number, HTMLIFrameElement>
}

export function CarouselSlide({ index, item, videoRefs, youtubeRefs }: Readonly<CarouselSlideProps>) {
  if (item.type === 'video') {
    return (
      <video
        aria-label='Video player'
        controls
        className='h-full w-full object-contain'
        ref={(el) => {
          if (el) {
            videoRefs.set(index, el)
          } else {
            videoRefs.delete(index)
          }
        }}
        src={item.src}
      >
        <track kind='captions' />
      </video>
    )
  }

  if (item.type === 'youtube') {
    return (
      <iframe
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        className='h-full w-full border-none bg-black'
        ref={(el) => {
          if (el) {
            youtubeRefs.set(index, el)
          } else {
            youtubeRefs.delete(index)
          }
        }}
        referrerPolicy='strict-origin-when-cross-origin'
        sandbox='allow-same-origin allow-scripts allow-forms'
        src={convertYouTubeIframeURL(item.src)}
        title='YouTube video player'
      />
    )
  }

  if (item.type === 'image') {
    return <img alt='' className='h-full w-full object-contain' src={item.src} />
  }

  if (item.type === 'cbz') {
    return <CbzViewer src={item.src} />
  }

  if (item.type === 'pdf') {
    return <iframe className='h-full w-full border-none' src={item.src} title='PDF viewer' />
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <span className='icon-[mdi--file-document] size-24 text-white' />
      <span className='text-sm text-white uppercase'>{getFileExtension(item.src)}</span>
      <a
        className='rounded bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600'
        download
        href={item.src}
        rel='noreferrer noopener'
        target='_blank'
      >
        Download
      </a>
    </div>
  )
}
