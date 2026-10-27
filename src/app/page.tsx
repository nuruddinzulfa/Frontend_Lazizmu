import Hero from '../components/home/Hero'
import FeaturedCampaigns from '../components/home/FeaturedCampaigns'
import QuickDonation from '../components/home/QuickDonation'
import WhyLazismu from '../components/home/WhyLazismu'
import AboutSection from '../components/home/AboutSection'
import ImpactStats from '../components/home/ImpactStats'
import Programs from '../components/home/Programs'
import FinancialTransparency from '../components/home/FinancialTransparency'
import Partners from '../components/home/Partners'
import NewsSection from '../components/home/NewsSection'
import FAQ from '../components/home/FAQ'
import type { NavPage } from '../App'

interface HomePageProps {
  onNavigate: (page: NavPage) => void
  onOpenPillar?: (category: string) => void
  onOpenContent?: (
    type: 'berita' | 'artikel',
    id: number
  ) => void
}

export default function HomePage({
  onNavigate,
  onOpenPillar,
  onOpenContent,
}: HomePageProps) {
  return (
    <main className="home-editorial">
      <Hero onNavigate={onNavigate} />

      <FeaturedCampaigns
        onNavigate={onNavigate}
      />

      <QuickDonation
        onNavigate={onNavigate}
      />

      <WhyLazismu />

      <AboutSection
        onNavigate={onNavigate}
      />

      <ImpactStats />

      <Programs
        onNavigate={onNavigate}
        onOpenPillar={onOpenPillar}
      />

      <FinancialTransparency />

      

      <NewsSection
        onNavigate={onNavigate}
        onOpenContent={onOpenContent}
      />

      <FAQ />
    </main>
  )
}
