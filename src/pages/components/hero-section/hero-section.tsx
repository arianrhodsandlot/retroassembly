import { Autoplay, FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getPlatformBanner } from '@/utils/library.ts'
import { HeroImages } from './hero-images.tsx'
import { HeroMain } from './hero-main.tsx'

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

export function HeroSection() {
  return (
    <section className='min-h-160 relative flex h-screen flex-col'>
      <div className='flex-1'>
        <div className='-z-1  absolute inset-0 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
        </div>

        <div className='w-7xl mx-auto flex h-full max-w-full flex-col items-center justify-center gap-20 overflow-hidden xl:flex-row'>
          <HeroMain />
          <HeroImages />
        </div>
      </div>
      <div className='pointer-events-none absolute bottom-2 flex w-full gap-4'>
        <Swiper
          autoplay={{ delay: 0, disableOnInteraction: false }}
          className='w-3xl mx-auto h-8 max-w-full overflow-hidden rounded [--swiper-wrapper-transition-timing-function:linear]'
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
      </div>
    </section>
  )
}
