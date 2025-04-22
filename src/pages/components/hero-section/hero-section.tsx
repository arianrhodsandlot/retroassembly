import { HeroMain } from './hero-main.tsx'
import { VisualEffect } from './visual-effect.tsx'

export function HeroSection() {
  return (
    <section className='relative h-screen min-h-96'>
      <div className='absolute inset-0 size-full'>
        <VisualEffect />
      </div>

      <div className='flex h-full'>
        <HeroMain />
        <div className='flex w-1/2 items-center justify-center'>
          <img
            alt='RetroAssembly logo'
            className='motion-preset-expand'
            height={220}
            src='/assets/logo/logo-512x512.png'
            width={220}
          />
        </div>
      </div>
    </section>
  )
}
