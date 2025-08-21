'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Rocket, Heart } from 'lucide-react'

export default function HomeCTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            あなたの学習を革新する、教育特化AIとの世界へ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/diagnosis"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              無料で始める
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              お問い合わせ
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}