'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: '大原 先生',
    role: '私立高校 国語教師（指導歴15年）',
    comment: '生徒一人ひとりの特性を理解し、最適化された指導ができる。これまでの経験とAIの力が組み合わさることで、教育の可能性が大きく広がります。',
    avatar: '👨‍🏫'
  },
  {
    name: '山田 塾長',
    role: '個人塾経営（生徒数120名）',
    comment: 'この新しい競合が生まれることにより、私たち側のサービス向上に繋がる。いいライバル(LIVAL)ですね（笑）',
    avatar: '👩‍💼'
  },
  {
    name: '佐藤 教授',
    role: '情報学（大学教授）',
    comment: '学習者の心理特性を科学的に分析し、個別最適化を実現するアプローチは画期的。若いチームの技術力と教育への情熱に期待しています。',
    avatar: '👨‍🎓'
  }
]

export default function AboutPartnersSection() {
  return (
    <section className="py-12 sm:py-20 bg-slate-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            パートナーの声
          </h2>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            現場を知る教育者、技術専門家、研究者の方々から
            いただいた貴重なご意見とメッセージです。
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
                
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-300 leading-relaxed italic">
                    "{testimonial.comment}"
                  </blockquote>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}