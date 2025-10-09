// src/app/features/page.tsx
import { Metadata } from 'next'
import FeaturesHeroSection from '@/components/features/FeaturesHeroSection'
import AIFeaturesSection from '@/components/features/AIFeaturesSection'
import MobileAppFeaturesSection from '@/components/features/MobileAppFeaturesSection'
import BlogFeaturesSection from '@/components/features/BlogFeaturesSection'
import FeaturesCTASection from '@/components/features/FeaturesCTASection'
import OpenChatSection from '@/components/features/OpenChatSection'

export const metadata: Metadata = {
  title: 'AIチャット機能 | Lival AI - 3種の専門AIコーチ',
  description: 'Lival AIの3つの専門AIチャット機能。学習プランナーAI、家庭教師AI、進路カウンセラーAIがあなたの学習を完全サポート。',
  keywords: 'Lival AI,学習プランナーAI,家庭教師AI,進路カウンセラーAI,AIチャット,パーソナライズ学習',
  openGraph: {
    title: 'AIチャット機能 | Lival AI',
    description: '3種の専門AIコーチがあなたの学習を完全サポート',
    type: 'website',
  }
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <FeaturesHeroSection />
      <AIFeaturesSection />
      <OpenChatSection />
      <MobileAppFeaturesSection />
      <BlogFeaturesSection />
      <FeaturesCTASection />
    </div>
  )
}
