'use client'

import Link from 'next/link'
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react'

export default function BlogFeaturesSection() {
  return (
    <section className="py-8 md:py-16 px-3 md:px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            <span>教育特化ブログ</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            質の高い教育コンテンツ
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2 md:px-0">
            <span className="hidden md:inline">
              運営による厳格な審査を通過した質の高い記事を通じて、<br />
              学習方法や教育に関する有用な情報をお届けします
            </span>
            <span className="md:hidden">
              運営審査済みの質の高い記事で学習方法や教育情報をお届け
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* ブログの特徴 */}
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-8 shadow-lg border border-gray-200">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-500" />
              ブログの特徴
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">運営による審査</h4>
                  <p className="text-gray-600 text-xs md:text-sm">全ての投稿記事は運営による厳格な審査を通過</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">多様な投稿者</h4>
                  <p className="text-gray-600 text-xs md:text-sm">教育関係者から学生まで様々な視点からの投稿</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">プレミアム記事</h4>
                  <p className="text-gray-600 text-xs md:text-sm">サブスク会員向けの特別な深掘り記事も提供</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">カテゴリ別整理</h4>
                  <p className="text-gray-600 text-xs md:text-sm">学習方法、進路相談、教育トレンドなど分野別に整理</p>
                </div>
              </div>
            </div>
          </div>

          {/* ブログの活用方法 */}
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-8 shadow-lg border border-gray-200">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
              <Lightbulb className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-yellow-500" />
              活用方法
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">学習方法の改善</h4>
                  <p className="text-gray-600 text-xs md:text-sm">効果的な勉強法や時間管理術を学ぶ</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">進路選択の参考</h4>
                  <p className="text-gray-600 text-xs md:text-sm">大学受験や進路選択に関する実用的な情報</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">教育トレンドの把握</h4>
                  <p className="text-gray-600 text-xs md:text-sm">最新の教育動向や技術活用法を理解</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">AIコーチとの連携</h4>
                  <p className="text-gray-600 text-xs md:text-sm">ブログ記事の内容をAIコーチとの対話で深掘り</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-semibold text-base md:text-lg"
          >
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            ブログを読む
          </Link>
        </div>
      </div>
    </section>
  )
}