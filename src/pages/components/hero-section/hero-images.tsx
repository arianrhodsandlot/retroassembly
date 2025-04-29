import clsx from 'clsx'
import { useState } from 'react'
import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const images = [
  '/assets/screenshots/library.jpeg',
  '/assets/screenshots/platform.jpeg',
  '/assets/screenshots/rom.jpeg',
  '/assets/screenshots/menu.jpeg',
]

export function HeroImages() {
  const [indicator, setIndicator] = useState({ current: 0, progress: 0 })

  return (
    <div className='flex flex-1 shrink-0 flex-col items-center justify-center gap-10'>
      <div className='rounded bg-white p-2 shadow-lg ring-1 ring-neutral-300'>
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className='w-2xl aspect-video overflow-hidden rounded'
          loop
          modules={[Autoplay, FreeMode, Thumbs]}
          onAutoplayTimeLeft={({ realIndex }, _time, progress) => {
            setIndicator({ current: realIndex, progress })
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
          <div
            className={clsx(
              'rounded-xs relative h-1.5 w-20 transition-colors',
              'after:bg-(--accent-9) after:absolute after:h-full after:rounded',
              index === indicator.current
                ? 'bg-(--accent-7) after:w-(--bar-width) after:opacity-100'
                : 'bg-(--accent-3) after:opacity-0',
            )}
            key={image}
            style={{
              '--bar-width': index === indicator.current ? `${100 - indicator.progress * 100}%` : '0',
            }}
          />
        ))}
      </div>
    </div>
  )
}
