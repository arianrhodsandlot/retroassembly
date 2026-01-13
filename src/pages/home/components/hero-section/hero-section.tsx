import { HeroMain } from './hero-main.tsx'
import { LogoSlider } from './logo-slider.tsx'
import { ScreenshotSlider } from './screenshot-slider.tsx'

export function HeroSection() {
  return (
    <section className='relative flex h-svh min-h-200 flex-col'>
      <div className='flex-1'>
        <div className='absolute inset-0 -z-1 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
        </div>

        <div className='mx-auto flex h-full w-7xl max-w-full flex-col items-center justify-center gap-20 overflow-hidden xl:flex-row'>
          <HeroMain />
          <ScreenshotSlider />
        </div>
      </div>

      <div className='mx-auto w-6xl max-w-full pb-8'>
        <LogoSlider />
      </div>
    </section>
  )
}
