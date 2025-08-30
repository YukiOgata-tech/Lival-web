'use client'

import HomeHeroSection from '@/components/sections/HomeHeroSection'
import HomeStatsSection from '@/components/sections/HomeStatsSection'
import HomeStudentTypesSection from '@/components/sections/HomeStudentTypesSection'
import HomeFeaturesSection from '@/components/sections/HomeFeaturesSection'
import HomeCredibilitySection from '@/components/sections/HomeCredibilitySection'
import HomeTestimonialsSection from '@/components/sections/HomeTestimonialsSection'
import HomeCTASection from '@/components/sections/HomeCTASection'
import ScrollToTop from '@/components/ui/ScrollToTop'
import FloatingProfileButton from '@/components/ui/FloatingProfileButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      {/* Hero Section */}
      <HomeHeroSection />

      {/* Stats Section */}
      <HomeStatsSection />

      {/* Student Types Section */}
      <HomeStudentTypesSection />

      {/* Features Section */}
      <HomeFeaturesSection />

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
    </div>
  )
}