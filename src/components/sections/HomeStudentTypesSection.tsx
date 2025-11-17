'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Lightbulb, ArrowRight } from 'lucide-react'

// 学習者タイプ
const studentTypes = [
  { name: '戦略家', description: '論理的思考で効率を重視', icon: '🎯', image: '/images/li-kun_val-chan/val-chan-ST-1.png', color: 'from-blue-400 to-blue-600' },
  { name: '探求家', description: '好奇心旺盛で発見を楽しむ', icon: '🔍', image: '/images/li-kun_val-chan/li-kun-EX-1.png', color: 'from-purple-400 to-purple-600' },
  { name: '努力家', description: '継続的な努力で成果を積み上げ', icon: '💪', image: '/images/li-kun_val-chan/li-kun-AC-1.png', color: 'from-green-400 to-green-600' },
  { name: '挑戦家', description: '競争を楽しみ限界に挑戦', icon: '⚡', image: '/images/li-kun_val-chan/li-kun-CH-1.png', color: 'from-red-400 to-red-600' },
  { name: '伴走者', description: '協力と共感を大切にする', icon: '🤝', image: '/images/li-kun_val-chan/val-chan-SP-1.png', color: 'from-pink-400 to-pink-600' },
  { name: '効率家', description: '最短ルートで結果を追求', icon: '🚀', image: '/images/li-kun_val-chan/li-kun-OP-1.jpg', color: 'from-orange-400 to-orange-600' }
]

export default function HomeStudentTypesSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-6">
            あなたは どのタイプ？
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            性格診断で6つの学習タイプを判定。それぞれに最適化されたAIコーチングを提供します。
          </p>
        </motion.div>

        {/* スマホ: 2列グリッド、タブレット以上: 3列グリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {studentTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 relative group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-contain rounded-2xl"
                  sizes="(max-width: 768px) 48px, 80px"
                />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 text-center">{type.name}</h3>
              {/* スマホでは詳細テキストを非表示 */}
              <p className="text-gray-600 text-center text-xs md:text-base hidden md:block">{type.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-6 md:mt-12 px-4"
        >
          <div className="flex flex-col space-y-3 md:flex-row md:justify-center md:items-center md:space-y-0 md:space-x-4">
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base md:text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">2分で診断スタート</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
            
            <Link
              href="/diagnosis/types"
              className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 border-2 border-purple-600 text-purple-600 text-sm md:text-base font-semibold rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="hidden md:inline">タイプ詳細を見る</span>
              <span className="md:hidden">詳細を見る</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Link>
          </div>
          
          {/* スマホ用：簡潔な説明文 */}
          <p className="text-xs text-gray-500 mt-3 md:hidden">
            タップして詳細を確認できます
          </p>
        </motion.div>
      </div>
    </section>
  )
}