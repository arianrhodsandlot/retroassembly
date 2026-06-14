import type { MouseEvent } from 'react'
import { FileTypeBadge } from '../file-type-badge.tsx'
import { CbzCover } from './cbz-thumbnail.tsx'
import type { MediaItem } from './game-media-carousel.tsx'
import { getYouTubeThumbnailUrl } from './youtube-utils.ts'

interface MediaThumbnailProps {
  alt: string
  index: number
  item: MediaItem
  onClick: (index: number, event: MouseEvent<HTMLElement>) => void
  thumbRefs: Map<number, HTMLElement>
}

export function MediaThumbnail({ alt, index, item, onClick, thumbRefs }: Readonly<MediaThumbnailProps>) {
  function thumbRef(el: HTMLElement | null) {
    if (el) {
      thumbRefs.set(index, el)
    }
  }

  if (item.type === 'video') {
    return (
      <button
        aria-label='Open video'
        className='relative shrink-0 cursor-pointer border-none bg-transparent p-0'
        onClick={(e) => onClick(index, e)}
        ref={thumbRef}
        type='button'
      >
        <video
          aria-label='Video thumbnail'
          className='pointer-events-none h-auto w-full lg:h-48 lg:w-auto'
          muted
          preload='metadata'
          src={item.src}
        >
          <track kind='captions' />
        </video>
        <FileTypeBadge className='absolute right-0 bottom-0 p-1 text-2xl' type='video' />
      </button>
    )
  }

  if (item.type === 'youtube') {
    return (
      <button
        className='relative shrink-0 cursor-pointer border-none bg-transparent p-0 lg:h-48 lg:w-auto'
        onClick={(e) => onClick(index, e)}
        ref={thumbRef}
        type='button'
      >
        <img
          alt='YouTube thumbnail'
          className='pointer-events-none h-auto w-full lg:h-48 lg:w-auto'
          loading='lazy'
          src={getYouTubeThumbnailUrl(item.src)}
        />
        <FileTypeBadge className='absolute right-0 bottom-0 p-1 text-4xl' type='youtube' />
      </button>
    )
  }

  if (item.type === 'cbz') {
    return (
      <button
        aria-label='Open comic'
        className='relative flex aspect-square shrink-0 cursor-pointer overflow-hidden border-none bg-neutral-200 p-0 lg:h-48 lg:w-auto lg:min-w-32'
        onClick={(e) => onClick(index, e)}
        ref={thumbRef}
        type='button'
      >
        <CbzCover src={item.src} />
        <FileTypeBadge className='absolute right-0 bottom-0 p-1 text-2xl' type='cbz' />
      </button>
    )
  }

  if (item.type === 'pdf') {
    return (
      <button
        aria-label='Open PDF'
        className='flex aspect-square shrink-0 cursor-pointer items-center justify-center border-none bg-neutral-200 p-2 lg:h-48 lg:w-auto lg:min-w-32'
        onClick={(e) => onClick(index, e)}
        ref={thumbRef}
        type='button'
      >
        <span className='icon-[mdi--file-pdf-box] size-12 text-[#a52516]' />
      </button>
    )
  }

  if (item.type === 'file') {
    return (
      <button
        aria-label='Open file'
        className='flex aspect-square shrink-0 cursor-pointer items-center justify-center border-none bg-neutral-200 p-2 lg:h-48 lg:w-auto lg:min-w-32'
        onClick={(e) => onClick(index, e)}
        ref={thumbRef}
        type='button'
      >
        <span className='icon-[mdi--file-document] size-12 text-neutral-500' />
      </button>
    )
  }

  return (
    <button
      className='shrink-0 cursor-pointer border-none bg-transparent p-0 empty:hidden'
      onClick={(e) => onClick(index, e)}
      ref={thumbRef}
      type='button'
    >
      <img alt={alt} className='pointer-events-none h-auto w-full lg:h-48 lg:w-auto' loading='lazy' src={item.src} />
    </button>
  )
}
