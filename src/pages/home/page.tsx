import { metadata } from '#@/constants/metadata.ts'
import { ButtonSection } from './components/button-section.tsx'
import { CommunitySection } from './components/community-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { FixedHeader } from './components/fixed-header.tsx'
import { FooterSection } from './components/footer-section.tsx'
import { HeroSection } from './components/hero-section/hero-section.tsx'
import { ReviewsSection } from './components/reviews-section.tsx'

export function HomePage() {
  return (
    <>
      <title>{metadata.title}</title>
      <FixedHeader />
      <HeroSection />
      <FeaturesSection />
      <ReviewsSection />
      <CommunitySection />
      <ButtonSection />
      <FooterSection />
    </>
  )
}
