// src/components/sections/about-related/AboutTeamSection.tsx
'use client'
import { motion } from 'framer-motion'
import { Code, Brain, Users, BookOpen, Palette, BarChart3 } from 'lucide-react'

const teamRoles = [
  {
    icon: Code,
    title: 'エンジニアチーム',
    description: '大学生を中心としたフルスタック開発者',
    members: '5名',
    skills: ['React/Next.js', 'Firebase', 'AI/ML', 'モバイル開発'],
    color: 'from-blue-500 to-indigo-600',
    highlight: '平均年齢: 21歳'
  },
  {
    icon: Brain,
    title: 'AI研究チーム',
    description: '機械学習・自然言語処理の専門家',
    members: '3名',
    skills: ['Python', 'TensorFlow', 'NLP', 'データサイエンス'],
    color: 'from-purple-500 to-violet-600',
    highlight: '博士・修士課程在籍'
  },
  {
    icon: BookOpen,
    title: '教育専門家',
    description: '現役教師・塾経営者・教育心理学者',
    members: '4名',
    skills: ['教育心理学', '学習指導', 'カリキュラム設計', '進路指導'],
    color: 'from-green-500 to-emerald-600',
    highlight: '平均指導歴: 8年'
  },
  {
    icon: Palette,
    title: 'デザインチーム',
    description: 'UI/UXデザイナー・クリエイター',
    members: '2名',
    skills: ['UI/UXデザイン', 'Figma', 'ユーザビリティ', 'ブランディング'],
    color: 'from-pink-500 to-rose-600',
    highlight: 'デザイン学部生'
  },
  {
    icon: BarChart3,
    title: 'ビジネスチーム',
    description: '事業戦略・マーケティング・運営',
    members: '3名',
    skills: ['事業開発', 'マーケティング', 'データ分析', '営業'],
    color: 'from-orange-500 to-amber-600',
    highlight: '経営学部・MBA'
  },
  {
    icon: Users,
    title: 'コミュニティ',
    description: 'ベータテスター・アドバイザー',
    members: '50+名',
    skills: ['フィードバック', 'テスト', 'コミュニティ運営', 'サポート'],
    color: 'from-teal-500 to-cyan-600',
    highlight: '全国の学習者'
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
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            多様なチームが創る未来
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            大学生の新鮮な発想力と、現場を知る教育者の経験が融合。
            世代を超えたコラボレーションで、革新的な教育プラットフォームを開発しています。
          </p>
        </motion.div>

        {/* Team Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {teamRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                <div className={`w-14 h-14 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-gray-400 mb-3 text-sm">{role.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-blue-400">{role.members}</span>
                  <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">{role.highlight}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="text-xs bg-gray-700/30 text-gray-300 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
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
          className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 rounded-3xl p-8 border border-gray-700/50"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">チームの価値観</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h4 className="text-lg font-semibold text-white mb-3">{value.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}