'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
        >
          <div className="bg-white/90 backdrop-blur-md border border-blue-100 rounded-2xl shadow-2xl p-6 md:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                <Cookie className="w-6 h-6" />
                <span>Cookieの使用について</span>
              </div>
              <button 
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              より良い体験を提供するためにCookieを使用しています。当サイトの利用を継続することで、
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium mx-1">
                プライバシーポリシー
              </Link>
              および
              <Link href="/cookies" className="text-blue-600 hover:underline font-medium mx-1">
                Cookieポリシー
              </Link>
              に同意したものとみなされます。
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
              >
                同意して閉じる
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 text-sm"
              >
                拒否する
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
