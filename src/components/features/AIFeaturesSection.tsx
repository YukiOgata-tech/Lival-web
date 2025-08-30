'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Calendar, 
  BookOpen, 
  Compass, 
  CheckCircle,
  ArrowRight,
  Users,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react'

const aiFeatures = [
  {
    id: 'learning-planner',
    name: '学習プランナーAI',
    subtitle: 'あなた専用の学習計画を立案',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'blue',
    description: '漠然とした悩みから具体的な学習計画まで、あなたの性格タイプに合わせて最適化された学習プランを提供',
    features: [
      '抽象的な悩み相談からスタート',
      '6つの性格タイプに基づくパーソナライズ',
      '対話を通じた課題の深掘り',
      '構造化されたカリキュラム自動生成',
      '学年・年齢に応じた適切な難易度調整',
      '継続的な学習サポート'
    ],
    userFlow: [
      { step: 1, title: '悩み相談', description: '「テストやばい」などの漠然とした不安を相談' },
      { step: 2, title: 'AI対話', description: 'AIが共感しながら具体的な課題を言語化' },
      { step: 3, title: '情報収集', description: '目標・期間・科目などの必要情報を整理' },
      { step: 4, title: '計画提案', description: 'AIが性格タイプに合わせた計画作成を提案' },
      { step: 5, title: 'カリキュラム生成', description: '専用モードで構造化された学習計画を出力' }
    ],
    personalizations: [
      { type: '探求家', approach: '知的ガイド型', example: '「なぜ」を大切にした発見的学習をサポート' },
      { type: '戦略家', approach: '論理的パートナー型', example: '目的から逆算した体系的な計画を提示' },
      { type: '努力家', approach: '励ましコーチ型', example: 'プロセスを褒めて成長を可視化' },
      { type: '挑戦家', approach: '競争パートナー型', example: 'ゲーム化して競争心を刺激' },
      { type: '伴走者', approach: '共感メンター型', example: '「一緒に」を重視した協調的サポート' },
      { type: '効率家', approach: '実務コンサルタント型', example: '結論から話す時間効率重視' }
    ]
  },
  {
    id: 'tutor-ai',
    name: '家庭教師AI',
    subtitle: '24時間いつでも質問対応',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'green',
    description: '分からない問題の解説から勉強方法の指導まで、個人の理解度に合わせた丁寧な指導を提供',
    features: [
      '24時間いつでも質問可能',
      '段階的な解説とヒント',
      '個人の理解度に応じた説明',
      '類似問題の自動生成',
      '弱点分析と改善提案',
      '学習履歴の蓄積と活用'
    ],
    benefits: [
      '即座の疑問解決で学習効率向上',
      '個別指導レベルの丁寧なサポート',
      '自分のペースで理解を深められる',
      '苦手分野の克服をサポート'
    ]
  },
  {
    id: 'career-counselor',
    name: '進路カウンセラーAI',
    subtitle: '将来の目標設定をサポート',
    icon: Compass,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'purple',
    description: '進路選択の悩みから具体的なキャリアプランまで、あなたの適性と興味に基づいた進路指導を提供',
    features: [
      '適性と興味の分析',
      '進路選択肢の提示',
      '大学・学部情報の提供',
      '資格・スキル習得のアドバイス',
      '面接・志望理由書の指導',
      '長期的なキャリアプラン作成'
    ],
    benefits: [
      '自分に合った進路の発見',
      '具体的な目標設定',
      '効率的な進路対策',
      '将来への不安の解消'
    ]
  }
]

export default function AIFeaturesSection() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const toggleExpand = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId)
  }

  return (
    <section className="py-8 md:py-16 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-gray-900 mb-3 md:mb-4 font-bold">
            3つの専門AIコーチ
          </h2>
          <p className="text-base md:text-xl text-gray-600">
            それぞれが異なる専門性を持ち、連携してあなたの学習を支援
          </p>
        </div>

        <div className="space-y-6 md:space-y-12">
          {aiFeatures.map((ai, index) => {
            const IconComponent = ai.icon
            const isExpanded = expandedFeature === ai.id
            const isLearningPlanner = ai.id === 'learning-planner'
            
            return (
              <div key={ai.id} className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                {/* ヘッダー */}
                <div className={`bg-gradient-to-r ${ai.color} p-4 md:p-8 text-white`}>
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-white/20 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                      <IconComponent className="w-6 h-6 md:w-10 md:h-10 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{ai.name}</h3>
                      <p className="text-base md:text-xl opacity-90">{ai.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-lg opacity-95 leading-relaxed mt-4 md:mt-6">{ai.description}</p>
                </div>

                {/* 詳細表示トグルボタン（モバイル用） */}
                <div className="md:hidden">
                  <button
                    onClick={() => toggleExpand(ai.id)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-700">
                      {isExpanded ? '詳細を閉じる' : '詳細を見る'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* コンテンツ - デスクトップは常に表示、モバイルは展開時のみ */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="md:!block md:!h-auto md:!opacity-100 overflow-hidden"
                    >
                      <div className="p-4 md:p-8">
                        {/* 学習プランナーAIの詳細 */}
                        {isLearningPlanner && (
                          <div className="space-y-6 md:space-y-12">
                            {/* 主要機能 */}
                            <div>
                              <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-500" />
                                主要機能
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {ai.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 font-medium text-sm md:text-base">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* ユーザー体験の流れ */}
                            <div>
                              <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-500" />
                                ユーザー体験の流れ
                              </h4>
                              <div className="relative">
                                <div className="hidden md:block absolute left-8 top-12 bottom-0 w-0.5 bg-blue-200"></div>
                                <div className="space-y-4 md:space-y-8">
                                  {ai.userFlow?.map((flow, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 md:space-x-6">
                                      <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
                                        {flow.step}
                                      </div>
                                      <div className="flex-1 pt-2 md:pt-3">
                                        <h5 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{flow.title}</h5>
                                        <p className="text-gray-600 text-sm md:text-base">{flow.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* パーソナライゼーション */}
                            <div>
                              <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
                                <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-purple-500" />
                                6つの性格タイプ別アプローチ
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                {ai.personalizations?.map((person, idx) => (
                                  <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg md:rounded-xl p-4 md:p-6">
                                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3 mb-2 md:mb-3">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full"></div>
                                        <h5 className="font-bold text-gray-900 text-sm md:text-base">{person.type}</h5>
                                      </div>
                                      <span className="text-xs md:text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full self-start md:self-auto">
                                        {person.approach}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-xs md:text-sm">{person.example}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 md:mt-6 text-center">
                                <Link
                                  href="/diagnosis/types"
                                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm md:text-base"
                                >
                                  6つの学習タイプについて詳しく
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 他のAI機能の詳細 */}
                        {!isLearningPlanner && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div>
                              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-500" />
                                主要機能
                              </h4>
                              <div className="space-y-2 md:space-y-3">
                                {ai.features.map((feature, idx) => (
                                  <div key={idx} className={`flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-${ai.bgColor}-50 rounded-lg`}>
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 bg-${ai.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                                    <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                                <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-500" />
                                期待される効果
                              </h4>
                              <div className="space-y-2 md:space-y-3">
                                {ai.benefits?.map((benefit, idx) => (
                                  <div key={idx} className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-yellow-50 rounded-lg">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-xs md:text-sm">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 開発中表示 */}
                        {!isLearningPlanner && (
                          <div className="mt-4 md:mt-8 text-center">
                            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium">
                              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              現在開発中 - 近日公開予定
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* デスクトップでは常に表示 */}
                <div className="hidden md:block">
                  <div className="p-8">
                    {/* 学習プランナーAIの詳細 */}
                    {isLearningPlanner && (
                      <div className="space-y-12">
                        {/* 主要機能 */}
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                            主要機能
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ai.features.map((feature, idx) => (
                              <div key={idx} className={`flex items-start space-x-3 p-4 bg-${ai.bgColor}-50 rounded-xl`}>
                                <div className={`w-2 h-2 bg-${ai.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                                <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ユーザー体験の流れ */}
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <ArrowRight className="w-6 h-6 mr-3 text-blue-500" />
                            ユーザー体験の流れ
                          </h4>
                          <div className="relative">
                            <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-blue-200"></div>
                            <div className="space-y-8">
                              {ai.userFlow?.map((flow, idx) => (
                                <div key={idx} className="flex items-start space-x-6">
                                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {flow.step}
                                  </div>
                                  <div className="flex-1 pt-3">
                                    <h5 className="text-lg font-bold text-gray-900 mb-2">{flow.title}</h5>
                                    <p className="text-gray-600">{flow.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* パーソナライゼーション */}
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Users className="w-6 h-6 mr-3 text-purple-500" />
                            6つの性格タイプ別アプローチ
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {ai.personalizations?.map((person, idx) => (
                              <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <h5 className="font-bold text-gray-900">{person.type}</h5>
                                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    {person.approach}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{person.example}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 text-center">
                            <Link
                              href="/diagnosis/types"
                              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                            >
                              6つの学習タイプについて詳しく
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 他のAI機能の詳細 */}
                    {!isLearningPlanner && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            主要機能
                          </h4>
                          <div className="space-y-3">
                            {ai.features.map((feature, idx) => (
                              <div key={idx} className={`flex items-start space-x-3 p-3 bg-${ai.bgColor}-50 rounded-lg`}>
                                <div className={`w-2 h-2 bg-${ai.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-500" />
                            期待される効果
                          </h4>
                          <div className="space-y-3">
                            {ai.benefits?.map((benefit, idx) => (
                              <div key={idx} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 text-sm">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 開発中表示 */}
                    {!isLearningPlanner && (
                      <div className="mt-8 text-center">
                        <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          現在開発中 - 近日公開予定
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}