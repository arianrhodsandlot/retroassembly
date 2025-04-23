import { HeroMain } from './hero-main.tsx'
import { VisualEffect } from './visual-effect.tsx'

export function HeroSection() {
  return (
    <section className='relative flex h-dvh min-h-96 flex-col'>
      <div className='z-1 border-b-(--accent-9) bg-(--accent-9) relative flex w-full items-center justify-between border-b px-8 py-4 text-white shadow shadow-black/30'>
        <span className='font-extrabold'>
          <img
            alt='RetroAssembly logo'
            className='motion-preset-expand'
            height={32}
            src='/assets/logo/logo-512x512.png'
            width={32}
          />
        </span>
        <div className='flex items-center gap-2'>
          <a href='https://github.com' rel='noreferrer noopener' target='_blank'>
            GitHub
          </a>
          <a href='https://github.com' rel='noreferrer noopener' target='_blank'>
            Discord
          </a>
        </div>
      </div>

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
