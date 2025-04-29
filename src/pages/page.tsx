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

      <footer className='bg-(--accent-9) py-4 text-center text-sm text-white'>
        <p>
          &copy; 2025{' '}
          <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer' target='_blank'>
            arianrhodsandlot
          </a>
          . All rights reserved.
        </p>
      </footer>
    </>
  )
}
