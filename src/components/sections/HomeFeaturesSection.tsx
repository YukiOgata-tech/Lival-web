'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  MessageCircle, 
  BookOpen, 
  Award, 
  Shield
} from 'lucide-react'

// 機能紹介
const features = [
  {
    icon: Brain,
    title: 'パーソナルAIコーチ',
    description: '6つの学習タイプに基づいた、あなただけのAI',
    shortDescription: 'あなた専用のAIチーム',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: Target,
    title: 'AIと人間によるダブルサポート環境',
    description: 'AIで質問、解決できない場合はLINEで質問が可能',
    shortDescription: '完璧なマルチ環境の提供',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: MessageCircle,
    title: '24時間サポート',
    description: 'いつでもどこでも、専門AIがあなたの質問に即座に回答',
    shortDescription: '24時間365日、質問に即座回答',
    color: 'from-green-500 to-blue-600'
  },
  {
    icon: BookOpen,
    title: '豊富な学習コンテンツ',
    description: '厳選されたYouTube動画や問題集で効率的な学習',
    shortDescription: '厳選コンテンツで効率学習',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: Award,
    title: '進捗可視化',
    description: '学習の成果を分かりやすくグラフで表示、モチベーション維持',
    shortDescription: '学習成果をグラフで可視化',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    icon: Shield,
    title: '安心・安全',
    description: '教育専門チーム監修のセキュアな学習環境',
    shortDescription: '安全な学習環境を提供',
    color: 'from-teal-500 to-green-600'
  }
]

export default function HomeFeaturesSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-6">
            選ばれる理由
          </h2>
          <p className="text-sm md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            最新の<span className='underline' >AI技術</span>と<span className='underline' >教育専門家</span>の知見を組み合わせた、
            <span className="block md:inline">革新的な学習プラットフォーム</span>
          </p>
          <p className="text-sm md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            どこよりも<span className='underline'>安く</span>、<span className='underline'>地域に関係ない</span>サポートが可能な
            <span className="block md:inline">塾に代わる教育システム</span>
          </p>
        </motion.div>

        {/* スマホ: 2列グリッド、タブレット以上: 3列グリッド */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`w-10 h-10 md:w-16 md:h-16 mb-3 md:mb-6 bg-gradient-to-r ${feature.color} rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-4 leading-tight">{feature.title}</h3>
              {/* スマホでは短縮版、PCでは詳細版 */}
              <p className="text-xs md:hidden text-gray-600 leading-relaxed">{feature.shortDescription}</p>
              <p className="hidden md:block text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}