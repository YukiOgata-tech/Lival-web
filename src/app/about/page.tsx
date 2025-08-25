import { Metadata } from 'next'
import AboutHeroSection from '@/components/sections/about-related/AboutHeroSection'
import AboutMissionSection from '@/components/sections/about-related/AboutMissionSection'
import AboutTeamSection from '@/components/sections/about-related/AboutTeamSection'
import AboutPartnersSection from '@/components/sections/about-related/AboutPartnersSection'
import AboutTimelineSection from '@/components/sections/about-related/AboutTimelineSection'
import AboutValuesSection from '@/components/sections/about-related/AboutValuesSection'
import AboutContactSection from '@/components/sections/about-related/AboutContactSection'
import ScrollToTop from '@/components/ui/ScrollToTop'

export const metadata: Metadata = {
  title: 'Lival AIについて - 教育を革新する私たちのミッション',
  description: 'Lival AIは中高生の学習を革新する教育技術企業です。科学的根拠に基づいた学習タイプ診断と3つの専門AIコーチで、一人ひとりに最適化された学習体験を提供しています。私たちのミッション、チーム、技術について詳しくご紹介します。',
  keywords: ['Lival AI', '会社概要', 'ミッション', '教育革新', 'チーム', '企業理念', '学習支援', 'AIエデュケーション', '教育技術'],
  openGraph: {
    title: 'Lival AIについて - 教育を革新する私たちのミッション',
    description: '科学的根拠に基づいた学習支援で教育を革新。私たちのミッション、チーム、そして技術について詳しくご紹介します。',
    type: 'website',
    url: 'https://lival.ai/about',
    images: [
      {
        url: '/og-image-about.png',
        width: 1200,
        height: 630,
        alt: 'Lival AIについて - 教育を革新する私たちのミッション'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lival AIについて - 教育を革新する私たちのミッション',
    description: '科学的根拠に基づいた学習支援で教育を革新。私たちのミッション、チーム、そして技術について。',
    images: ['/og-image-about.png']
  },
  alternates: {
    canonical: 'https://lival.ai/about'
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      
      {/* Hero Section */}
      <AboutHeroSection />

      {/* Mission Section */}
      <AboutMissionSection />

      {/* Team Section */}
      <AboutTeamSection />

      {/* Partners Section */}
      <AboutPartnersSection />

      {/* Timeline Section */}
      <AboutTimelineSection />

      {/* Values Section */}
      <AboutValuesSection />

      {/* Contact Section */}
      <AboutContactSection />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}