import { CommunitySection } from './components/community-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { HeroSection } from './components/hero-section.tsx'

export default function HomePage() {
  return (
    <>
      <title>RetroAssembly</title>

      <HeroSection />
      <FeaturesSection />
      <CommunitySection />

      <footer className='mt-10 text-center text-sm text-gray-400'>
        <p>&copy; 2025 RetroAssembly. All rights reserved.</p>
      </footer>
    </>
  )
}
