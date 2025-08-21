'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lightbulb, ArrowRight } from 'lucide-react'

// 学習者タイプ
const studentTypes = [
  { name: '戦略家', description: '論理的思考で効率を重視', icon: '🎯', color: 'from-blue-400 to-blue-600' },
  { name: '探求家', description: '好奇心旺盛で発見を楽しむ', icon: '🔍', color: 'from-purple-400 to-purple-600' },
  { name: '努力家', description: '継続的な努力で成果を積み上げ', icon: '💪', color: 'from-green-400 to-green-600' },
  { name: '挑戦家', description: '競争を楽しみ限界に挑戦', icon: '⚡', color: 'from-red-400 to-red-600' },
  { name: '伴走者', description: '協力と共感を大切にする', icon: '🤝', color: 'from-pink-400 to-pink-600' },
  { name: '効率家', description: '最短ルートで結果を追求', icon: '🚀', color: 'from-orange-400 to-orange-600' }
]

export default function HomeStudentTypesSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            あなたは どのタイプ？
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            性格診断で6つの学習タイプを判定。それぞれに最適化されたAIコーチングを提供します。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{type.name}</h3>
              <p className="text-gray-600 text-center">{type.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/diagnosis"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            2分で診断スタート
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}