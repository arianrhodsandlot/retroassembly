import { HeroMain } from './hero-main.tsx'
import { LogoSlider } from './logo-slider.tsx'
import { ScreenshotSlider } from './screenshot-slider.tsx'

export function HeroSection() {
  return (
    <section className='min-h-200 relative flex h-svh flex-col'>
      <div className='flex-1'>
        <div className='-z-1  absolute inset-0 size-full'>
          <div className='hero-bg absolute inset-0 size-full' />
        </div>

        <div className='w-7xl mx-auto flex h-full max-w-full flex-col items-center justify-center gap-20 overflow-hidden xl:flex-row'>
          <HeroMain />
          <ScreenshotSlider />
        </div>
      </div>

      <div className='w-6xl mx-auto max-w-full pb-8'>
        <LogoSlider />
      </div>
    </section>
  )
}
