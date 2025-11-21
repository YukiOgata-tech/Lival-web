'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: '中原 先生',
    role: '私立高校 国語教師（指導歴15年+）',
    comment: '学校外での学習効果が受験や成績向上に大きく影響します。経験とAIの力が組み合わさることで、教育の可能性が大きく広がることを証明したいと感じてきました。',
    avatar: '👨‍🏫'
  },
  {
    name: '山田 塾長',
    role: '個人塾経営（生徒数60名+）',
    comment: '本来は強豪であるこのサービスの考案に私も一部協力させていただきました。新しい競合が生まれることで、塾側のサービス向上に繋がる。いいライバル(LIVAL)ですね（笑）',
    avatar: '👩‍💼'
  },
  {
    name: 'S 教授(非公開)',
    role: '情報学（准教授）',
    comment: '学習者の心理特性を科学的に分析し、個別最適化を実現するアプローチを考案しました。若いチームの教育への情熱にすごく期待しています。',
    avatar: '👨‍🎓'
  }
]

export default function AboutPartnersSection() {
  return (
    <section className="py-8 sm:py-16 bg-slate-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
            パートナーの声
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            現場を知る教育者、技術者、研究者の方々から
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                <blockquote className="text-gray-300 leading-relaxed italic text-sm">
                  "{testimonial.comment}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}