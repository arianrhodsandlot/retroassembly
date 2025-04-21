import { HeroMain } from './hero-main.tsx'
import { VisualEffect } from './visual-effect.tsx'

export function HeroSection() {
  return (
    <section className='relative h-screen min-h-96'>
      <div className='absolute inset-0 size-full bg-[var(--accent-4)]' />

      <div className='bg-linear-to-b absolute inset-0 size-full from-transparent via-white to-white' />

      <div className='absolute inset-0 size-full'>
        <VisualEffect />
      </div>

      <div className='z-1 relative flex h-full'>
        <HeroMain />
        <div className='flex w-1/2 items-center justify-center'>logo</div>
      </div>
    </section>
  )
}
