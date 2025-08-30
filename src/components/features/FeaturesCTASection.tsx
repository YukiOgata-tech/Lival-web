'use client'

import Link from 'next/link'
import { Target, Clock } from 'lucide-react'

export default function FeaturesCTASection() {
  return (
    <section className="py-8 md:py-16 px-3 md:px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-6">
          あなたに最適な学習体験を始めよう
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 px-2 md:px-0">
          <span className="hidden md:inline">
            まずは無料の学習タイプ診断で、あなたに合ったAIコーチングを体験してください
          </span>
          <span className="md:hidden">
            無料の学習タイプ診断で、あなたに合ったAIコーチングを体験
          </span>
        </p>
        
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-center md:items-center md:space-x-6">
          <Link
            href="/diagnosis"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-base md:text-lg justify-center"
          >
            <Target className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            学習タイプ診断を始める
          </Link>
          
          <div className="flex items-center justify-center text-xs md:text-sm text-gray-600">
            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            所要時間: 約5-8分
          </div>
        </div>
      </div>
    </section>
  )
}