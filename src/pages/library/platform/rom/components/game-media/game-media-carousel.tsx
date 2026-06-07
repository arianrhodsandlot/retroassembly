import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RadixThemePortal } from '#@/pages/components/radix-theme-portal.tsx'
import { convertYouTubeIframeURL } from './youtube-embed.tsx'

export interface MediaItem {
  type: 'image' | 'video'
  src: string
}

interface GameMediaCarouselProps {
  items: MediaItem[]
  initialIndex: number
  originRect: DOMRect | null
  open: boolean
  onClose: (currentIndex: number) => void
  onSlideChange: (index: number) => void
}

export function GameMediaCarousel({
  items,
  initialIndex,
  originRect,
  open,
  onClose,
  onSlideChange,
}: Readonly<GameMediaCarouselProps>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: initialIndex })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) {
      return
    }
    const idx = emblaApi.selectedScrollSnap()
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setCurrentIndex(idx)
    onSlideChange(idx)
  }, [emblaApi, onSlideChange])

  useEffect(() => {
    if (!emblaApi) {
      return
    }
    onEmblaSelect()
    emblaApi.on('select', onEmblaSelect)
    emblaApi.on('reInit', onEmblaSelect)
    return () => {
      emblaApi.off('select', onEmblaSelect)
      emblaApi.off('reInit', onEmblaSelect)
    }
  }, [emblaApi, onEmblaSelect])

  const handleClose = useCallback(() => {
    onClose(currentIndexRef.current)
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }
    const abortController = new AbortController()

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          handleClose()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          emblaApi?.scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          emblaApi?.scrollNext()
        }
      },
      { signal: abortController.signal },
    )

    document.body.style.overflow = 'hidden'

    return () => {
      abortController.abort()
      document.body.style.overflow = ''
    }
  }, [open, handleClose, emblaApi])

  const panelAnimProps = useMemo(() => {
    if (!originRect) {
      return {
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        initial: { opacity: 0, scale: 0.95 },
      }
    }
    const left = Math.round(originRect.left)
    const top = Math.round(originRect.top)
    const width = Math.round(originRect.width)
    const height = Math.round(originRect.height)
    return {
      animate: {
        height: Math.round(window.innerHeight * 0.9),
        left: Math.round(window.innerWidth * 0.05),
        top: Math.round(window.innerHeight * 0.05),
        width: Math.round(window.innerWidth * 0.9),
      },
      exit: { height, left, top, width },
      initial: { height, left, top, width },
    }
  }, [originRect])

  return (
    <RadixThemePortal>
      <AnimatePresence>
        {open ? (
          <>
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden
              className='fixed inset-0 z-50 cursor-default bg-black/80'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={handleClose}
            />
            {/* Panel */}
            <motion.div
              animate={panelAnimProps.animate}
              className='fixed z-50'
              exit={panelAnimProps.exit}
              initial={panelAnimProps.initial}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex h-full flex-col overflow-hidden' ref={emblaRef}>
                <div className='flex h-full'>
                  {items.map((item, index) => (
                    <div className='flex min-h-0 min-w-0 flex-[0_0_100%] items-center justify-center' key={index}>
                      {item.type === 'video' ? (
                        <iframe
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                          allowFullScreen
                          className='h-full w-full border-none bg-black'
                          referrerPolicy='strict-origin-when-cross-origin'
                          sandbox='allow-same-origin allow-scripts allow-forms'
                          src={convertYouTubeIframeURL(item.src)}
                          title='YouTube video player'
                        />
                      ) : (
                        <img alt='' className='h-full w-full object-contain' src={item.src} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Prev button */}
            {canScrollPrev ? (
              <motion.button
                animate={{ opacity: 1 }}
                aria-label='Previous'
                className='fixed top-1/2 left-[calc(5vw+0.75rem)] z-50 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => emblaApi?.scrollPrev()}
                type='button'
              >
                <span className='icon-[mdi--chevron-left] block size-6' />
              </motion.button>
            ) : null}
            {/* Next button */}
            {canScrollNext ? (
              <motion.button
                animate={{ opacity: 1 }}
                aria-label='Next'
                className='fixed top-1/2 right-[calc(5vw+0.75rem)] z-50 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => emblaApi?.scrollNext()}
                type='button'
              >
                <span className='icon-[mdi--chevron-right] block size-6' />
              </motion.button>
            ) : null}
            {/* Close button */}
            <motion.button
              animate={{ opacity: 1 }}
              aria-label='Close'
              className='fixed top-4 right-4 z-50 cursor-pointer rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={handleClose}
              type='button'
            >
              <span className='icon-[mdi--close] block size-6' />
            </motion.button>
          </>
        ) : null}
      </AnimatePresence>
    </RadixThemePortal>
  )
}
