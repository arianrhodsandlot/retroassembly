import { ButtonSection } from './components/button-section.tsx'
import { CommunitySection } from './components/community-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { HeroSection } from './components/hero-section/hero-section.tsx'

export function HomePage() {
  return (
    <>
      <title>RetroAssembly</title>

      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <ButtonSection />

      <footer className='py-4 text-center text-sm'>
        <p>&copy; 2025 RetroAssembly. All rights reserved.</p>
      </footer>
    </>
  )
}
