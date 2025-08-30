'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  GraduationCap, 
  BarChart3, 
  CheckCircle,
  Brain,
  ArrowRight,
  Users,
  Award
} from 'lucide-react'

export default function HomeCredibilitySection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            科学的根拠に基づく診断
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
            従来の学習スタイル診断とは違い、40年以上の心理学研究で実証された理論を採用
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md text-center"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">自己決定理論</h3>
            <p className="text-xs md:text-sm text-gray-600">40年の研究で実証された動機理論</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md text-center"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Big Five理論</h3>
            <p className="text-xs md:text-sm text-gray-600">最も科学的に確立された性格モデル</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md text-center"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">検証済み</h3>
            <p className="text-xs md:text-sm text-gray-600">77.4%の高い行動整合率を確認</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md border-l-4 border-blue-500">
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              詳しい理論的背景や実証研究データを知りたい方は
            </p>
            <Link
              href="/about/science"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors text-sm md:text-base"
            >
              <GraduationCap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              <span className="hidden sm:inline">科学的根拠を詳しく見る</span>
              <span className="sm:hidden">詳細を見る</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}