'use client'

import Link from 'next/link'
import { Brain, Target, Sparkles, Clock } from 'lucide-react'

export default function FeaturesHeroSection() {
  return (
    <section className="relative py-12 md:py-20 px-3 md:px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
          <Brain className="w-3 h-3 md:w-4 md:h-4" />
          <span>3種の専門AIコーチ</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-4 md:mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            AIチャット機能
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8 md:mb-12 px-2 md:px-0">
          <span className="hidden md:inline">
            <span className="font-medium text-blue-700">学習プランナーAI</span>、<span className="font-medium text-green-700">家庭教師AI</span>、<span className="font-medium text-purple-700">進路カウンセラーAI</span>の3つの専門AIが、<br />
            あなたの学習スタイルに<span className="font-medium text-orange-600">完全適応</span>して、個別最適化された指導を提供します
          </span>
          <span className="md:hidden">
            3つの専門AI（<span className="font-medium text-blue-700">学習プランナー</span>・<span className="font-medium text-green-700">家庭教師</span>・<span className="font-medium text-purple-700">進路カウンセラー</span>）があなたの学習スタイルに完全適応
          </span>
        </p>

        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-center md:items-center md:space-x-6">
          <Link
            href="/diagnosis"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-base md:text-lg justify-center"
          >
            <Target className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            まずは学習タイプ診断
          </Link>
          
          <Link
            href="/signup"
            className="inline-flex items-center border-2 border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-base md:text-lg justify-center"
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            無料で始める
          </Link>
        </div>
      </div>
    </section>
  )
}