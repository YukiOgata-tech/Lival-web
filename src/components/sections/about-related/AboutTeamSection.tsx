// src/components/sections/about-related/AboutTeamSection.tsx
'use client'
import { motion } from 'framer-motion'
import { Code, Brain, Users, BookOpen, Palette, BarChart3 } from 'lucide-react'

const teamRoles = [
  {
    icon: Code,
    title: 'エンジニア',
    description: '最新技術を活用し、スケーラブルで安全なプラットフォームを構築。フロントエンドからバックエンド、AIインフラまで幅広い技術領域をカバーしています。',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Brain,
    title: 'AI研究',
    description: '機械学習と自然言語処理のスペシャリストが、教育に特化したAIシステムを研究開発。学習者一人ひとりに最適化されたパーソナライズを実現しています。',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: BookOpen,
    title: '教育専門',
    description: '現場での豊富な指導経験を持つ教育者たちが、学習理論とテクノロジーを融合。効果的な学習体験をデザインしています。',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Palette,
    title: 'デザイン',
    description: '直感的で使いやすいユーザーインターフェースを設計。学習者が集中できる環境と、魅力的な学習体験を創造しています。',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: BarChart3,
    title: 'ビジネス',
    description: '事業戦略からマーケティング、運営まで幅広く担当。教育の社会的意義とビジネスの持続可能性を両立させています。',
    color: 'from-orange-500 to-amber-600'
  },
  {
    icon: Users,
    title: 'コミュニティ',
    description: '全国の学習者やベータテスターと連携し、リアルなフィードバックを収集。ユーザー目線でのプロダクト改善を推進しています。',
    color: 'from-teal-500 to-cyan-600'
  }
]

const teamValues = [
  {
    title: '学習者ファースト',
    description: 'すべての判断基準は「学習者にとって本当に価値があるか」'
  },
  {
    title: '継続的な改善',
    description: '失敗を恐れず、常に学び、成長し続ける文化'
  },
  {
    title: '多様性の尊重',
    description: '異なる背景・専門性を持つメンバーが協働する強み'
  },
  {
    title: '透明性',
    description: 'オープンなコミュニケーションと情報共有'
  }
]

export default function AboutTeamSection() {
  return (
    <section className="py-8 sm:py-16 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
            多様なチームが創る未来
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
            大学生の新鮮な発想力と、現場を知る教育者の経験が融合。
            世代を超えたコラボレーションで、革新的な教育プラットフォームを開発しています。
          </p>
        </motion.div>

        {/* Team Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20">
          {teamRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl" 
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">{role.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">{role.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-700/50"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center">チームの価値観</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {teamValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 md:mb-3">{value.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}