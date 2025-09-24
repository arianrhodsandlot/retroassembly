import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getPlatformBanner } from '@/utils/client/library.ts'

const platforms = [
  'atari2600',
  'nes',
  'famicom',
  'snes',
  'genesis',
  'megadrive',
  'sg-1000',
  'arcade',
  'gb',
  'gbc',
  'gba',
  'virtualboy',
  'gamegear',
  'ngp',
  'wonderswan',
]

export function LogoSlider() {
  return (
    <Swiper
      autoplay={{ delay: 0, disableOnInteraction: false }}
      className='mx-auto h-8 max-w-full flex-1 overflow-hidden rounded [--swiper-wrapper-transition-timing-function:linear]'
      freeMode
      loop
      modules={[Autoplay, FreeMode, Thumbs]}
      slidesPerView='auto'
      spaceBetween={40}
      speed={5000}
    >
      {platforms.map((platform) => (
        <SwiperSlide className='flex h-8 !w-20 items-center' key={platform}>
          <img alt={platform} className='h-8 w-full' src={getPlatformBanner(platform)} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
