'use client'

import { motion } from 'framer-motion'
import { Code2, TestTube, Users, BarChart3, CheckCircle, Target } from 'lucide-react'

const developmentPhases = [
  {
    id: 'prototype',
    title: 'プロトタイプ開発',
    period: '2023年10月 - 2024年1月',
    icon: Code2,
    description: '科学的根拠に基づく学習診断とAIコーチング機能の初期バージョンを開発',
    achievements: [
      '自己決定理論（SDT）とBig Five理論に基づく診断システム構築',
      '6つの学習タイプ分類アルゴリズムの実装',
      '3つの専門AIエージェント（家庭教師・進路カウンセラー・学習プランナー）の基礎開発',
      'React Native モバイルアプリとFirebaseバックエンドの構築'
    ],
    technologies: ['React Native', 'Firebase', 'OpenAI API', 'Node.js', 'TypeScript'],
    status: 'completed'
  },
  {
    id: 'beta',
    title: 'ベータテスト実施',
    period: '2024年2月 - 2024年5月',
    icon: TestTube,
    description: '協力校・塾での実証実験により、実際の学習環境での効果を検証',
    achievements: [
      '県立高等学校1校、私立学習塾2校での実証実験',
      '中高生30名による3ヶ月間の継続利用テスト',
      '診断精度77.4%の達成（学習行動パターンとの整合率）',
      '学習継続率85%を記録（従来の塾平均65%を大幅改善）'
    ],
    technologies: ['データ分析', 'ユーザビリティテスト', 'A/Bテスト', 'フィードバック分析'],
    status: 'completed'
  },
  {
    id: 'web',
    title: 'Webプラットフォーム開発',
    period: '2024年6月 - 現在',
    icon: Target,
    description: 'モバイルアプリの成果を踏まえ、より幅広いユーザーに対応するWebプラットフォームを開発',
    achievements: [
      'Next.js 15とReact 19を活用した最新Web技術の導入',
      'モバイルアプリとのデータ完全同期システム構築',
      'プレミアムプラン（月額4,980円）の設計・実装',
      'レスポンシブデザインによる全デバイス対応'
    ],
    technologies: ['Next.js 15', 'React 19', 'TypeScript 5', 'Tailwind CSS 4', 'Framer Motion'],
    status: 'in-progress'
  }
]

const betaTestResults = [
  {
    metric: '診断精度',
    value: '77.4%',
    description: '学習行動パターンとの整合率',
    icon: '🎯',
    improvement: '+12.4%'
  },
  {
    metric: '学習継続率',
    value: '85%',
    description: '3ヶ月間の継続利用率',
    icon: '📈',
    improvement: '+20%'
  },
  {
    metric: 'ユーザー満足度',
    value: '4.2/5.0',
    description: 'ベータテスト参加者評価',
    icon: '⭐',
    improvement: '新規指標'
  },
  {
    metric: '学習効率',
    value: '+35%',
    description: '従来学習法との比較',
    icon: '⚡',
    improvement: '目標達成'
  }
]

export default function AboutPrototypeBetaSection() {
  return (
    <section className="py-12 sm:py-20 bg-gray-900">
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
            プロトタイプ開発とベータテスト
          </h2>
          <p className="text-base sm:text-xl text-gray-300 max-w-4xl mx-auto px-4 sm:px-0">
            科学的根拠に基づく学習支援システムの開発から実証実験まで。
            実際の教育現場での検証を通じて、確かな効果を実証しています。
          </p>
        </motion.div>

        {/* Development Phases */}
        <div className="space-y-8 sm:space-y-16 mb-12 sm:mb-20">
          {developmentPhases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${
                    phase.status === 'completed' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    <phase.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white">{phase.title}</h3>
                    <p className="text-blue-400 font-medium text-sm sm:text-base">{phase.period}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">
                  {phase.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-lg sm:text-xl font-semibold text-white">主な成果</h4>
                  <div className="space-y-2">
                    {phase.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm sm:text-base">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-semibold text-white">使用技術</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className={`relative rounded-2xl p-4 sm:p-8 ${
                  phase.status === 'completed' 
                    ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20' 
                    : 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20'
                } border backdrop-blur-sm`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center ${
                      phase.status === 'completed' 
                        ? 'bg-green-500/20 border-green-500/30' 
                        : 'bg-blue-500/20 border-blue-500/30'
                    } border-2`}>
                      <phase.icon className={`w-8 h-8 sm:w-12 sm:h-12 ${
                        phase.status === 'completed' ? 'text-green-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <h4 className="text-lg sm:text-2xl font-bold text-white mb-2">{phase.title}</h4>
                    <p className={`font-medium ${
                      phase.status === 'completed' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {phase.status === 'completed' ? '開発完了' : '開発進行中'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beta Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl p-8 border border-purple-500/20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">ベータテスト結果</h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              3ヶ月間のベータテストで実証された、LIVAL AIの学習効果。
              科学的な手法による測定で確かな成果を確認しています。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {betaTestResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 text-center"
              >
                <div className="text-4xl mb-4">{result.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{result.value}</div>
                <h4 className="font-semibold text-gray-200 mb-2 text-sm sm:text-base">{result.metric}</h4>
                <p className="text-xs sm:text-sm text-gray-400 mb-3">{result.description}</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  {result.improvement}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-4">実証実験の詳細</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">30名</div>
                  <p className="text-gray-300 text-sm sm:text-base">参加学習者数</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">3校</div>
                  <p className="text-gray-300 text-sm sm:text-base">協力教育機関</p>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-400">3ヶ月</div>
                  <p className="text-gray-300 text-sm sm:text-base">実証期間</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}