import { clsx } from 'clsx'
import { useRef, useState } from 'react'
import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import useSWRImmutable from 'swr/immutable'
import { imageLoaded } from '@/utils/image.ts'

const video = '/assets/screenrecordings/import-roms.mp4'
const images = [
  '/assets/screenshots/library.jpeg',
  '/assets/screenshots/platform.jpeg',
  '/assets/screenshots/rom.jpeg',
  '/assets/screenshots/menu.jpeg',
]

export function ScreenshotSlider() {
  const [indicator, setIndicator] = useState({ current: 0, progress: 0 })
  const swiperRef = useRef<SwiperType>(null)
  const [swiperDelay, setSliderDelay] = useState(40_000)

  const { isLoading: isVideoLoading } = useSWRImmutable(video, (video) =>
    fetch(video, { cache: 'force-cache', method: 'head' }),
  )

  const { isLoading: areImagesLoading } = useSWRImmutable(images.slice(0, 1), (images) =>
    Promise.all(images.map((image) => imageLoaded(image))),
  )

  const isLoading = isVideoLoading || areImagesLoading

  return (
    <div className='hidden flex-1 shrink-0 flex-col items-center justify-center gap-10 xl:flex'>
      <div className='border-1 border-(--gray-4) bg-(--color-background) rounded p-2'>
        {isLoading ? (
          <div className='w-2xl flex aspect-video items-center justify-center overflow-hidden rounded bg-neutral-200'>
            <span className='icon-[svg-spinners--180-ring] block size-12 text-neutral-300' />
          </div>
        ) : (
          <Swiper
            autoplay={{ delay: swiperDelay, disableOnInteraction: false }}
            className='w-2xl aspect-video overflow-hidden rounded'
            loop
            modules={[Autoplay, FreeMode, Thumbs]}
            onAutoplayTimeLeft={({ realIndex }, _time, progress) => {
              setIndicator({ current: realIndex, progress })
            }}
            onSlideChange={({ realIndex }) => {
              setSliderDelay(realIndex ? 3000 : 20_000)
              const video = document.querySelector('video')
              if (video) {
                video.currentTime = 0
                if (realIndex === 0) {
                  video.play()
                }
              }
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            spaceBetween={20}
          >
            <SwiperSlide>
              <video
                autoPlay
                className='block size-full rounded bg-neutral-200 object-contain'
                controls={false}
                loop
                muted
                src={video}
              />
            </SwiperSlide>
            {images.map((image) => (
              <SwiperSlide key={image}>
                <img alt='library' className='block rounded object-contain' src={image} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className='flex gap-2'>
        {['', ...images].map((image, index) => (
          <button
            className={clsx(
              'rounded-xs relative h-1.5 w-20 transition-colors',
              'after:bg-(--accent-9) after:absolute after:left-0 after:top-0 after:h-full after:rounded',
              index === indicator.current && !isLoading
                ? 'bg-(--accent-7) after:w-(--bar-width) after:opacity-100'
                : 'bg-(--accent-3) after:opacity-0',
            )}
            disabled={isLoading}
            key={image}
            onClick={() => {
              swiperRef.current?.slideToLoop(index)
            }}
            style={{
              // @ts-expect-error css variable is not supported by React.CSSProperties yet
              '--bar-width': index === indicator.current ? `${100 - indicator.progress * 100}%` : '0',
            }}
            title='Slide to this image'
            type='button'
          />
        ))}
      </div>
    </div>
  )
}
