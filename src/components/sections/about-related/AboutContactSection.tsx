'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'

export default function AboutContactSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-800 to-slate-800/80 rounded-2xl p-6 sm:p-10 text-center border border-gray-700"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            未来の教育を、共に。
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            私たちのビジョンに共感いただけましたか？<br />
            ご質問、協業のご提案、メディア取材など、お気軽にご連絡ください。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 text-base"
            >
              お問い合わせフォームへ
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.a>

            <motion.a
              href="/documents/service-guide.pdf" // 仮のパス
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-full hover:border-gray-500 hover:text-white transition-all duration-300 text-base"
            >
              資料請求（PDF）
              <Download className="w-5 h-5 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
