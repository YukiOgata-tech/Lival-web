// src/app/features/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Brain, 
  Calendar, 
  Target, 
  Users, 
  BookOpen, 
  Lightbulb, 
  Compass, 
  MessageCircle, 
  CheckCircle,
  Clock,
  Smartphone,
  BarChart3,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  ChevronDown
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIチャット機能 | Lival AI - 3種の専門AIコーチ',
  description: 'Lival AIの3つの専門AIチャット機能。学習プランナーAI、家庭教師AI、進路カウンセラーAIがあなたの学習を完全サポート。',
  keywords: 'Lival AI,学習プランナーAI,家庭教師AI,進路カウンセラーAI,AIチャット,パーソナライズ学習',
  openGraph: {
    title: 'AIチャット機能 | Lival AI',
    description: '3種の専門AIコーチがあなたの学習を完全サポート',
    type: 'website',
  }
}

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

const mobileAppFeatures = [
  { icon: Clock, title: '学習時間管理', description: '詳細な学習時間の記録・分析' },
  { icon: BarChart3, title: '進捗可視化', description: '学習状況をグラフで分かりやすく表示' },
  { icon: Trophy, title: '達成度トラッキング', description: '目標達成度の継続的な追跡' },
  { icon: Star, title: 'モチベーション管理', description: '学習継続を促す仕組み' },
  { icon: CheckCircle, title: 'タスク管理', description: '日々の学習課題を効率的に管理' },
  { icon: Users, title: 'コミュニティ機能', description: '同じ目標を持つ仲間との交流' }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヒーローセクション */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            <span>3種の専門AIコーチ</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AIチャット機能
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12">
            学習プランナーAI、家庭教師AI、進路カウンセラーAIの3つの専門AIが、<br />
            あなたの学習スタイルに完全適応して、個別最適化された指導を提供します
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/diagnosis"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              <Target className="w-6 h-6 mr-2" />
              まずは学習タイプ診断
            </Link>
            
            <Link
              href="/signup"
              className="inline-flex items-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              無料で始める
            </Link>
          </div>
        </div>
      </section>

      {/* AI機能詳細セクション */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              3つの専門AIコーチ
            </h2>
            <p className="text-xl text-gray-600">
              それぞれが異なる専門性を持ち、連携してあなたの学習を支援
            </p>
          </div>

          <div className="space-y-20">
            {aiFeatures.map((ai, index) => {
              const IconComponent = ai.icon
              return (
                <div key={ai.id} className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* ヘッダー */}
                  <div className={`bg-gradient-to-r ${ai.color} p-8 text-white`}>
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold mb-2">{ai.name}</h3>
                        <p className="text-xl opacity-90">{ai.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-lg opacity-95 leading-relaxed">{ai.description}</p>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-8">
                    {/* 学習プランナーAIの詳細 */}
                    {ai.id === 'learning-planner' && (
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
                    {ai.id !== 'learning-planner' && (
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
                    {ai.id !== 'learning-planner' && (
                      <div className="mt-8 text-center">
                        <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          現在開発中 - 近日公開予定
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* モバイルアプリ機能セクション */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              <span>モバイルアプリ（サブスク会員限定）</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              包括的な学習管理システム
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AIチャットに加えて、学習時間管理から進捗分析まで、<br />
              すべての学習サポート機能をモバイルアプリで利用可能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileAppFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/subscription"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              <Smartphone className="w-6 h-6 mr-2" />
              サブスクリプション詳細
            </Link>
          </div>
        </div>
      </section>

      {/* ブログ機能セクション */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>教育特化ブログ</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              質の高い教育コンテンツ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              運営による厳格な審査を通過した質の高い記事を通じて、<br />
              学習方法や教育に関する有用な情報をお届けします
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ブログの特徴 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                ブログの特徴
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">運営による審査</h4>
                    <p className="text-gray-600 text-sm">全ての投稿記事は運営による厳格な審査を通過</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">多様な投稿者</h4>
                    <p className="text-gray-600 text-sm">教育関係者から学生まで様々な視点からの投稿</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">プレミアム記事</h4>
                    <p className="text-gray-600 text-sm">サブスク会員向けの特別な深掘り記事も提供</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">カテゴリ別整理</h4>
                    <p className="text-gray-600 text-sm">学習方法、進路相談、教育トレンドなど分野別に整理</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ブログの活用方法 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                活用方法
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">学習方法の改善</h4>
                    <p className="text-gray-600 text-sm">効果的な勉強法や時間管理術を学ぶ</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">進路選択の参考</h4>
                    <p className="text-gray-600 text-sm">大学受験や進路選択に関する実用的な情報</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">教育トレンドの把握</h4>
                    <p className="text-gray-600 text-sm">最新の教育動向や技術活用法を理解</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AIコーチとの連携</h4>
                    <p className="text-gray-600 text-sm">ブログ記事の内容をAIコーチとの対話で深掘り</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              <BookOpen className="w-6 h-6 mr-2" />
              ブログを読む
            </Link>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            あなたに最適な学習体験を始めよう
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            まずは無料の学習タイプ診断で、あなたに合ったAIコーチングを体験してください
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/diagnosis"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
            >
              <Target className="w-6 h-6 mr-2" />
              学習タイプ診断を始める
            </Link>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              所要時間: 約5-8分
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}