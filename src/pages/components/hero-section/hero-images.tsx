import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'

const images = [
  '/assets/screenshots/library.jpeg',
  '/assets/screenshots/platform.jpeg',
  '/assets/screenshots/rom.jpeg',
  '/assets/screenshots/menu.jpeg',
]

export function HeroImages() {
  const [indicator, setIndicator] = useState({ current: 0, progress: 0 })
  const swiperRef = useRef<SwiperType>(null)

  return (
    <div className='hidden flex-1 shrink-0 flex-col items-center justify-center gap-10 xl:flex'>
      <div className='rounded bg-white p-2 shadow-lg ring-1 ring-neutral-300'>
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className='w-2xl aspect-video overflow-hidden rounded'
          loop
          modules={[Autoplay, FreeMode, Thumbs]}
          onAutoplayTimeLeft={({ realIndex }, _time, progress) => {
            setIndicator({ current: realIndex, progress })
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          spaceBetween={20}
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <img alt='library' className='block rounded object-contain' src={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='flex gap-2'>
        {images.map((image, index) => (
          <button
            className={clsx(
              'rounded-xs relative h-1.5 w-20 transition-colors',
              'after:bg-(--accent-9) after:absolute after:left-0 after:top-0 after:h-full after:rounded',
              index === indicator.current
                ? 'bg-(--accent-7) after:w-(--bar-width) after:opacity-100'
                : 'bg-(--accent-3) after:opacity-0',
            )}
            key={image}
            onClick={() => {
              swiperRef.current?.slideToLoop(index)
            }}
            style={{
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
