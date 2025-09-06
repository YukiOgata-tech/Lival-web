// src/components/sections/about-related/AboutValuesSection.tsx
'use client'
import { motion } from 'framer-motion'
import { Heart, Users, Lightbulb, Shield, Globe, Zap } from 'lucide-react'

const coreValues = [
  {
    icon: Heart,
    title: '学習者への愛',
    description: 'すべての判断基準は「学習者にとって本当に価値があるか」。一人ひとりの成長を心から願い、そのために最善を尽くします。',
    color: 'from-red-500 to-pink-600',
    examples: [
      '24時間365日のサポート体制',
      '個人情報の厳格な保護',
      '継続的なフィードバック収集'
    ]
  },
  {
    icon: Users,
    title: '多様性の力',
    description: '異なる背景、専門性、世代が集まることで生まれる創造性を大切にします。多様な視点が革新を生み出します。',
    color: 'from-blue-500 to-purple-600',
    examples: [
      '大学生と現役教師の協働',
      '文理融合チーム編成',
      'インクルーシブなデザイン'
    ]
  },
  {
    icon: Lightbulb,
    title: '継続的革新',
    description: '現状に満足せず、常に学び、改善し続けます。失敗を恐れず、挑戦することで教育の未来を切り開きます。',
    color: 'from-yellow-500 to-orange-600',
    examples: [
      '週次の技術勉強会',
      'ユーザーフィードバック即座反映',
      '最新研究成果の積極導入'
    ]
  },
  {
    icon: Shield,
    title: '信頼と透明性',
    description: '教育という重要な分野に携わる責任を深く理解し、透明性のあるコミュニケーションと確実な成果でユーザーの信頼に応えます。',
    color: 'from-green-500 to-teal-600',
    examples: [
      'オープンソースでの開発',
      '定期的な進捗報告',
      'セキュリティ監査の実施'
    ]
  },
  {
    icon: Globe,
    title: '社会への貢献',
    description: '教育格差の解消、不登校支援、地域振興など、テクノロジーの力で社会課題の解決に取り組みます。',
    color: 'from-indigo-500 to-blue-600',
    examples: [
      '過疎地域での無償提供',
      '不登校児童へのサポート',
      'NPOとの協力プログラム'
    ]
  },
  {
    icon: Zap,
    title: 'スピードと品質',
    description: '若いチームの機動力を活かし、高品質なサービスを迅速に提供します。ユーザーの「今」のニーズに応えます。',
    color: 'from-purple-500 to-violet-600',
    examples: [
      '2週間スプリント開発',
      '48時間以内のサポート対応',
      '月次機能アップデート'
    ]
  }
]

const impactMetrics = [
  { number: '1,000+', label: '支援した学習者', description: '全国の中高生が利用' },
  { number: '95%', label: '満足度', description: 'ユーザー評価平均' },
  { number: '20点', label: '平均成績向上', description: '3ヶ月利用での効果' },
  { number: '24時間', label: '平均応答時間', description: 'AI応答時間' },
  { number: '15+', label: 'チームメンバー', description: '多世代・多分野' },
  { number: '100%', label: 'セキュリティ', description: 'データ保護レベル' }
]

export default function AboutValuesSection() {
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
            私たちの価値観
          </h2>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            技術力だけでなく、教育への情熱と社会への責任感が、
            LIVAL AIの原動力です。
          </p>
        </motion.div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-20">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">{value.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">具体的な取り組み</h4>
                  {value.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-gray-400 text-xs sm:text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 rounded-3xl p-8 border border-gray-700/50"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">私たちの実績</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{metric.number}</div>
                <div className="text-blue-400 font-semibold mb-1 text-sm sm:text-base">{metric.label}</div>
                <div className="text-gray-400 text-xs leading-tight">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">一緒に教育の未来を創りませんか？</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            私たちの価値観に共感し、教育の革新に貢献したい方を募集しています。
            エンジニア、デザイナー、教育者、ビジネス... あらゆる分野の専門家との出会いをお待ちしています。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <motion.a
              href="/careers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
            >
              採用情報を見る
            </motion.a>
            
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-full hover:border-gray-500 hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              お問い合わせ
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}