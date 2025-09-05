'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MessageCircle, 
  BookOpen, 
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  Target
} from 'lucide-react'

export default function HomeAIAgentsSection() {
  const agents = [
    {
      name: '学習プランナーAI',
      description: 'あなた専用の学習計画を立案',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      features: ['対話型相談', 'プラン作成', 'PDF出力']
    },
    {
      name: '家庭教師AI',
      description: '24時間質問対応',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      features: ['個別指導', '解説付き', '弱点分析'],
      comingSoon: true
    },
    {
      name: '進路カウンセラーAI',
      description: '将来の目標設定をサポート',
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      features: ['適性分析', '進路提案', 'キャリア相談'],
      comingSoon: true
    }
  ]

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AIエージェント機能
            </div>
            
            {/* 見出しと画像の2列レイアウト（スマホ・タブレット）*/}
            <div className="flex items-center justify-between lg:justify-center lg:flex-col lg:gap-0 max-w-full px-4 sm:px-6">
              <div className="flex-1 text-center lg:text-center">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                  3つの専門AIが<br />
                  あなたをサポート
                </h2>
              </div>
              
              {/* スマホ・タブレット用小さな画像 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex-shrink-0 lg:hidden flex items-center justify-center"
              >
                <Image
                  src="/images/AIs.png"
                  alt="LIVAL AI エージェント"
                  width={200}
                  height={200}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                  priority
                />
              </motion.div>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              学習プランナー、家庭教師、進路カウンセラーの3つのAIエージェントが連携して、
              あなたの学習を総合的にサポートします。
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* 左側: PC用大きな画像 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="hidden lg:block text-center lg:text-left"
          >
            <Image
              src="/images/AIs.png"
              alt="LIVAL AI エージェント"
              width={400}
              height={400}
              className="w-full h-auto max-w-md mx-auto lg:mx-0"
              priority
            />
          </motion.div>

          {/* AIエージェント情報: スマホ・タブレットは全幅、PCは右側 */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {agents.map((agent, index) => {
              const IconComponent = agent.icon
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${agent.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{agent.name}</h3>
                        {agent.comingSoon && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium text-xs">
                            開発中
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {agent.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 text-xs px-2 sm:px-3 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link
              href="/lival-agent-mode/threads/planner"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg font-semibold w-full sm:w-auto text-center justify-center"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              プランナーAIを体験
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
            </Link>
            
            <Link
              href="/lival-agent-mode/threads"
              className="inline-flex items-center border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 text-base sm:text-lg font-semibold w-full sm:w-auto text-center justify-center"
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              スレッド一覧を見る
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
            </Link>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4 sm:px-0">
            ※ 家庭教師AI・進路カウンセラーAIは現在開発中です
          </p>
        </motion.div>
      </div>
    </section>
  )
}
