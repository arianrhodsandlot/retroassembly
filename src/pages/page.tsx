import { ButtonSection } from './components/button-section.tsx'
import { CommunitySection } from './components/community-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { FixedHeader } from './components/fixed-header.tsx'
import { HeroSection } from './components/hero-section/hero-section.tsx'

export function HomePage() {
  return (
    <>
      <title>RetroAssembly</title>

      <FixedHeader />
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <ButtonSection />

      <footer className='border border-x-0 border-b-0 border-t-neutral-200 py-8 text-center text-sm font-light text-neutral-600'>
        <p>
          Released under{' '}
          <a className='underline' href='https://opensource.org/license/mit' rel='noreferrer noopener' target='_blank'>
            the MIT License
          </a>
          . &copy; 2025{' '}
          <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer noopener' target='_blank'>
            arianrhodsandlot
          </a>
          . All rights reserved.
        </p>
      </footer>
    </>
  )
}
