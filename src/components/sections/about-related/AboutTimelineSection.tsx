'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Code, Rocket, Trophy, Target } from 'lucide-react'

const timelineEvents = [
  {
    date: '2023年4月',
    title: 'プロジェクト発足',
    description: '大学生5名が教育格差の課題に着目し、AIを活用した個別指導の研究を開始',
    icon: Calendar,
    status: 'completed',
    details: [
      '教育心理学の文献調査',
      '既存サービスの分析',
      '問題定義とコンセプト策定'
    ]
  },
  {
    date: '2023年7月',
    title: '教育専門家との協力開始',
    description: '現役教師・塾経営者3名がアドバイザーとして参画。現場のニーズを深く理解',
    icon: Users,
    status: 'completed',
    details: [
      '現場ヒアリング（50時間）',
      '学習者タイプ分類の検証',
      'ペルソナ設計'
    ]
  },
  {
    date: '2023年10月',
    title: 'プロトタイプ開発',
    description: '性格診断機能とAIチャット機能の初期バージョンを開発・テスト開始',
    icon: Code,
    status: 'completed',
    details: [
      'React Native アプリ開発',
      'Firebase バックエンド構築',
      'AI モデルの初期訓練'
    ]
  },
  {
    date: '2024年2月',
    title: 'ベータテスト実施',
    description: '協力校・塾での実証実験。30名の学習者によるベータテストを実施',
    icon: Rocket,
    status: 'completed',
    details: [
      '3校での実証実験',
      'フィードバック収集・分析',
      'UI/UX 大幅改善'
    ]
  },
  {
    date: '2024年6月',
    title: '正式サービス開始',
    description: '個人向けサービスを正式リリース。月間アクティブユーザー1,000名を達成',
    icon: Trophy,
    status: 'completed',
    details: [
      'iOS/Android アプリ公開',
      'セキュリティ監査完了',
      'カスタマーサポート開始'
    ]
  },
  {
    date: '2024年12月',
    title: 'Webプラットフォーム開発',
    description: '管理者向け機能とWebサイトの開発。塾・学校向けサービスの準備',
    icon: Target,
    status: 'in-progress',
    details: [
      'Next.js Webサイト開発',
      '管理者ダッシュボード',
      'エンタープライズ機能'
    ]
  }
]

export default function AboutTimelineSection() {
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
            歩んできた道のり
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            2023年春の小さなアイデアから始まり、多くの方々の協力を得て、
            今日のLIVAL AIが誕生しました。
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
          
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start"
              >
                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                  event.status === 'completed' 
                    ? 'bg-green-500 border-green-400' 
                    : event.status === 'in-progress'
                    ? 'bg-blue-500 border-blue-400'
                    : 'bg-gray-600 border-gray-500'
                }`}>
                  <event.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-semibold">{event.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : event.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {event.status === 'completed' ? '完了' : event.status === 'in-progress' ? '進行中' : '予定'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>
                    
                    <div className="space-y-2">
                      {event.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          <span className="text-gray-400 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Plans */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 border border-blue-500/20"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">これからの展望</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '2025年春',
                description: '全国100校での導入、海外展開の準備開始',
                icon: '🌸'
              },
              {
                title: '2025年夏',
                description: 'AI機能の大幅強化、多言語対応リリース',
                icon: '☀️'
              },
              {
                title: '2025年冬',
                description: 'グローバル展開、10万人の学習者サポート',
                icon: '❄️'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{plan.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{plan.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}