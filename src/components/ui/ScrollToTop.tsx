// src/components/ui/ScrollToTop.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

interface ScrollToTopProps {
  showThreshold?: number
  className?: string
}

export default function ScrollToTop({ 
  showThreshold = 300,
  className = ""
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const toggleVisibility = () => {
      if (window.pageYOffset > showThreshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showThreshold])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!isMounted) return null

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          aria-label="ページトップに戻る"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </>
  )
}