import { Metadata } from 'next'
import AboutHeroSection from '@/components/sections/about-related/AboutHeroSection'
import AboutMissionSection from '@/components/sections/about-related/AboutMissionSection'
import AboutTeamSection from '@/components/sections/about-related/AboutTeamSection'
import AboutPartnersSection from '@/components/sections/about-related/AboutPartnersSection'
import AboutPrototypeBetaSection from '@/components/sections/about-related/AboutPrototypeBetaSection'
import AboutValuesSection from '@/components/sections/about-related/AboutValuesSection'
import AboutContactSection from '@/components/sections/about-related/AboutContactSection'
import ScrollToTop from '@/components/ui/ScrollToTop'

export const metadata: Metadata = {
  title: 'Lival AIについて - 教育を革新する私たちのミッション',
  description: 'Lival AIは塾や予備校に代わる新しい学習体験を創造する教育技術企業です。高額な塾費用の負担なく、月額4,980円で24時間365日の個別指導を実現。科学的根拠に基づいた学習タイプ診断と3つの専門AIコーチで、従来の塾・予備校を超える学習効果を提供します。',
  keywords: ['Lival AI', '塾代替', '予備校代替', '会社概要', 'ミッション', '教育革新', 'コスト削減', '個別指導', '24時間サポート', '学習支援', 'AIエデュケーション', '教育技術'],
  openGraph: {
    title: 'Lival AIについて - 教育を革新する私たちのミッション',
    description: '塾・予備校に代わる新しい教育体験を創造。月額4,980円で従来の塾費用を大幅削減し、24時間365日の学習サポートを実現。',
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

      {/* Prototype & Beta Testing Section */}
      <AboutPrototypeBetaSection />

      {/* Values Section */}
      <AboutValuesSection />

      {/* Contact Section */}
      <AboutContactSection />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}