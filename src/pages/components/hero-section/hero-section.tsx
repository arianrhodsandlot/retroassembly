import { HeroMain } from './hero-main.tsx'
import { VisualEffect } from './visual-effect.tsx'

export function HeroSection() {
  return (
    <section className='relative flex h-dvh min-h-96 flex-col'>
      <div className='relative flex-1'>
        <div className='absolute inset-0 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
          <VisualEffect />
        </div>

        <div className='w-7xl mx-auto flex h-full'>
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
      </div>
    </section>
  )
}
