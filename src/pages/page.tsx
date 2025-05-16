import { ButtonSection } from './components/button-section.tsx'
import { CommunitySection } from './components/community-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { FixedHeader } from './components/fixed-header.tsx'
import { FooterSection } from './components/footer-section.tsx'
import { HeroSection } from './components/hero-section/hero-section.tsx'

export function HomePage({ pageData }: { pageData: { currentUser: any } }) {
  const { currentUser } = pageData

  return (
    <>
      <title>RetroAssembly</title>
      <FixedHeader currentUser={currentUser} />
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <ButtonSection />
      <FooterSection />
    </>
  )
}
