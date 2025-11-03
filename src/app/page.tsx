'use client'

import HomeHeroSection from '@/components/sections/HomeHeroSection'
import HomeStatsSection from '@/components/sections/HomeStatsSection'
import HomeStudentTypesSection from '@/components/sections/HomeStudentTypesSection'
import HomeAIAgentsSection from '@/components/sections/HomeAIAgentsSection'
import HomeFeaturesSection from '@/components/sections/HomeFeaturesSection'
import OpenChatSection from '@/components/features/OpenChatSection'
import HomeCredibilitySection from '@/components/sections/HomeCredibilitySection'
import HomeTestimonialsSection from '@/components/sections/HomeTestimonialsSection'
import HomeCTASection from '@/components/sections/HomeCTASection'
import ScrollToTop from '@/components/ui/ScrollToTop'
import FloatingProfileButton from '@/components/ui/FloatingProfileButton'
import FloatingEmailVerifyButton from '@/components/ui/FloatingEmailVerifyButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      {/* Hero Section */}
      <HomeHeroSection />

      {/* Stats Section */}
      <HomeStatsSection />

      {/* Student Types Section */}
      <HomeStudentTypesSection />

      {/* AI Agents Section */}
      <HomeAIAgentsSection />

      {/* Features Section */}
      <HomeFeaturesSection />

      {/* Open Chat Section */}
      <OpenChatSection />

      {/* Credibility Section */}
      <HomeCredibilitySection />

      {/* Testimonials Section */}
      <HomeTestimonialsSection />

      {/* CTA Section */}
      <HomeCTASection />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Floating Profile Setup Button */}
      <FloatingProfileButton />

      {/* Floating Email Verification Button (unverified users) */}
      <FloatingEmailVerifyButton />
    </div>
  )
}
