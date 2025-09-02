'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Rocket, Heart } from 'lucide-react'

export default function HomeCTASection() {
  return (
    <section className="py-12 pt-6 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90 px-4">
            あなたの学習を革新する、教育特化AIとの世界へ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto px-4 sm:px-0">
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 text-base md:text-lg font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              無料で始める
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white text-base md:text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              お問い合わせ
            </Link>
          </div>
          
          {/* スマホ用追加情報 */}
          <div className="mt-6 md:hidden">
            <p className="text-sm opacity-80">
              📱 診断は3分で完了します
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}