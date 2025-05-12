import { HeroImages } from './hero-images.tsx'
import { HeroMain } from './hero-main.tsx'

export function HeroSection() {
  return (
    <section className='min-h-160 relative flex h-dvh flex-col'>
      <div className='flex-1'>
        <div className='-z-1  absolute inset-0 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
        </div>

        <div className='w-7xl mx-auto flex h-full gap-20 overflow-hidden'>
          <HeroMain />
          <HeroImages />
        </div>
      </div>
    </section>
  )
}
