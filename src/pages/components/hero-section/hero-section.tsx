import { HeroImages } from './hero-images.tsx'
import { HeroMain } from './hero-main.tsx'
import { VisualEffect } from './visual-effect.tsx'

export function HeroSection() {
  return (
    <section className='relative flex h-dvh min-h-96 flex-col'>
      <div className='flex-1'>
        <div className='-z-1  absolute inset-0 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
          <VisualEffect />
        </div>

        <div className='w-7xl mx-auto flex h-full gap-20 overflow-hidden'>
          <HeroMain />
          <HeroImages />
        </div>
      </div>
    </section>
  )
}
