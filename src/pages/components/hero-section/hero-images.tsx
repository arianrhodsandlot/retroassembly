import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const images = [
  '/assets/screenshots/library.jpeg',
  '/assets/screenshots/platform.jpeg',
  '/assets/screenshots/rom.jpeg',
  '/assets/screenshots/menu.jpeg',
]

export function HeroImages() {
  return (
    <div className='flex flex-1 shrink-0 items-center justify-center'>
      <div className='rounded bg-white p-2 shadow-lg ring-1 ring-neutral-300'>
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className='w-2xl aspect-video overflow-hidden rounded'
          loop
          modules={[Autoplay, FreeMode, Thumbs]}
          spaceBetween={20}
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <img alt='library' className='block rounded object-contain' src={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
