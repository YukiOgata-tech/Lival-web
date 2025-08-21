'use client'

import AboutHeroSection from '@/components/sections/about-related/AboutHeroSection'
import AboutMissionSection from '@/components/sections/about-related/AboutMissionSection'
import AboutTeamSection from '@/components/sections/about-related/AboutTeamSection'
import AboutPartnersSection from '@/components/sections/about-related/AboutPartnersSection'
import AboutTimelineSection from '@/components/sections/about-related/AboutTimelineSection'
import AboutValuesSection from '@/components/sections/about-related/AboutValuesSection'
import AboutContactSection from '@/components/sections/about-related/AboutContactSection'
import ScrollToTop from '@/components/ui/ScrollToTop'

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