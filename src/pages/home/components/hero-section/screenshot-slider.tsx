import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { imageLoaded } from '#@/utils/client/image.ts'

const images = [
  '/assets/screenshots/library.jpeg',
  '/assets/screenshots/platform.jpeg',
  '/assets/screenshots/rom.jpeg',
  '/assets/screenshots/menu.jpeg',
]

const SLIDE_DURATION = 3000

export function ScreenshotSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isLoading } = useSWRImmutable(images[0], (image) => imageLoaded(image))

  useEffect(() => {
    if (isLoading) {
      return
    }
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [isLoading, currentIndex])

  return (
    <div className='hidden flex-1 shrink-0 flex-col items-center justify-center gap-10 xl:flex'>
      <div className='rounded border border-(--gray-4) bg-(--color-background) p-2'>
        {isLoading ? (
          <div className='flex aspect-video w-2xl items-center justify-center overflow-hidden rounded bg-neutral-200'>
            <span className='icon-[svg-spinners--180-ring] block size-12 text-neutral-300' />
          </div>
        ) : (
          <div className='relative aspect-video w-2xl overflow-hidden rounded'>
            <div
              className='flex h-full transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image) => (
                <img alt='Screenshot' className='block size-full object-contain' key={image} src={image} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex gap-2'>
        {images.map((image, index) => (
          <button
            className={clsx('relative h-1.5 w-20 overflow-hidden rounded-xs transition-colors', 'bg-(--accent-3)', {
              'bg-(--accent-7)': index === currentIndex && !isLoading,
            })}
            disabled={isLoading}
            key={image}
            onClick={() => setCurrentIndex(index)}
            title='Slide to this image'
            type='button'
          >
            {index === currentIndex && !isLoading && <ProgressBar duration={SLIDE_DURATION} />}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProgressBar({ duration }: { readonly duration: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setWidth(100)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className='absolute top-0 left-0 h-full rounded bg-(--accent-9)'
      style={{
        transition: `width ${duration}ms linear`,
        width: `${width}%`,
      }}
    />
  )
}
