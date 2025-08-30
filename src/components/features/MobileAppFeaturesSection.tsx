'use client'

import Link from 'next/link'
import { 
  Clock,
  BarChart3,
  Trophy,
  Star,
  CheckCircle,
  Users,
  Smartphone
} from 'lucide-react'

const mobileAppFeatures = [
  { icon: Clock, title: '学習時間管理', description: '詳細な学習時間の記録・分析' },
  { icon: BarChart3, title: '進捗可視化', description: '学習状況をグラフで分かりやすく表示' },
  { icon: Trophy, title: '達成度トラッキング', description: '目標達成度の継続的な追跡' },
  { icon: Star, title: 'モチベーション管理', description: '学習継続を促す仕組み' },
  { icon: CheckCircle, title: 'タスク管理', description: '日々の学習課題を効率的に管理' },
  { icon: Users, title: 'コミュニティ機能', description: '同じ目標を持つ仲間との交流' }
]

export default function MobileAppFeaturesSection() {
  return (
    <section className="py-8 md:py-16 px-3 md:px-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
            <span>モバイルアプリ（サブスク会員限定）</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            包括的な学習管理システム
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2 md:px-0">
            <span className="hidden md:inline">
              AIチャットに加えて、学習時間管理から進捗分析まで、<br />
              すべての学習サポート機能をモバイルアプリで利用可能
            </span>
            <span className="md:hidden">
              AIチャットに加えて、学習管理・進捗分析などの機能をモバイルアプリで利用可能
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {mobileAppFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-2 md:mb-4 mx-auto md:mx-0">
                  <IconComponent className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 text-center md:text-left">{feature.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm text-center md:text-left">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/subscription"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-base md:text-lg"
          >
            <Smartphone className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            サブスクリプション詳細
          </Link>
        </div>
      </div>
    </section>
  )
}