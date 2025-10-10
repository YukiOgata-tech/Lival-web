'use client'

import { useMemo, useState } from 'react'
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
  EyeOff,
  List,
  Settings,
  BarChart,
  Download,
  RefreshCw
} from 'lucide-react'

const aiFeatures = [
  {
    id: 'learning-planner',
    name: '学習プランナーAI',
    subtitle: 'あなた専用の学習計画を立案',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'blue',
    status: 'live',
    description: '漠然とした悩みから具体的な学習計画まで、対話型AIがあなたの状況を理解して最適化された学習プランを提供',
    features: [
      '対話形式での悩み相談・課題抽出',
      'チャット画面でのインタラクティブなやり取り',
      'スレッド管理による継続的な相談',
      'プラン作成専用モードでの構造化された入力',
      '期間・優先科目・目標・学習時間を考慮した計画',
      'PDF出力機能でオフラインでも確認可能'
    ],
    userFlow: [
      { step: 1, title: 'チャット開始', description: '新規スレッドを作成して学習相談を開始' },
      { step: 2, title: '対話で課題抽出', description: 'AIとの自然な会話で現在の状況や悩みを整理' },
      { step: 3, title: 'プラン作成モード', description: '「作成モード」ボタンでプラン作成専用画面に移行' },
      { step: 4, title: '詳細情報入力', description: '期間・重要視ポイント・目標・1日の学習時間を入力' },
      { step: 5, title: '学習計画生成', description: 'AIが入力情報を基に構造化された学習計画を生成' },
      { step: 6, title: '計画の活用', description: 'プランカード表示・詳細モーダル・PDF出力で計画を確認' }
    ],
    practicalFeatures: [
      { title: 'インタラクティブチャット', description: 'リアルタイムでAIと対話しながら学習の悩みや課題を相談できます', icon: 'MessageCircle' },
      { title: 'スレッド管理', description: '複数の相談テーマを整理して、継続的にサポートを受けられます', icon: 'List' },
      { title: 'プラン作成専用UI', description: '期間・優先科目・目標・学習時間を構造化して入力する専用画面', icon: 'Settings' },
      { title: '計画のビジュアル化', description: '生成された学習計画を分かりやすいカード形式で表示', icon: 'BarChart' },
      { title: 'PDF出力', description: '作成した学習計画をPDFとしてダウンロードしてオフラインで活用', icon: 'Download' },
      { title: 'プラン再生成', description: '状況変化に合わせて計画を調整・再生成できます', icon: 'RefreshCw' }
    ],
    personalizations: [
      { type: '探求家', approach: '発見重視型', example: '背景理論から学ぶアプローチで深い理解を促進' },
      { type: '戦略家', approach: '体系的計画型', example: '目標から逆算した論理的で効率的な学習計画' },
      { type: '努力家', approach: '段階的成長型', example: '小さな成功を積み重ねるステップバイステップ方式' },
      { type: '挑戦家', approach: '競争刺激型', example: 'ライバルを意識した挑戦的な目標設定' },
      { type: '伴走者', approach: '協調サポート型', example: '「一緒に頑張ろう」を重視した共感的サポート' },
      { type: '効率家', approach: '結果重視型', example: '最短ルートでの成果達成を重視した実用的計画' }
    ]
  },
  {
    id: 'tutor-ai',
    name: '家庭教師AI',
    subtitle: '写真でもテキストでも、24時間すぐ解決',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'green',
    status: 'live',
    description: '問題の写真を送るだけ。読み取り→わかりやすい解説→復習までスムーズに。あなたの理解度に合わせて、無理なく「わかった！」を積み重ねられます。',
    features: [
      '写真送信で問題をそのまま質問（手書きもOK）',
      '要点→手順→結論の順にわかりやすく解説',
      '間違えやすいポイントに先回りして注意',
      '重要・暗記・要確認のタグ付けで復習しやすい',
      'タグ付き発言からレポート自動作成',
      'スレッド管理でテーマごとに会話を整理',
      '端末間で学習履歴を同期（PC/スマホ）',
      '24時間いつでも質問可能'
    ],
    benefits: [
      '写真1枚で質問完了。説明に迷わずすぐ聞ける',
      '自分のつまずきに合わせた解説で理解が深まる',
      'タグやレポートで復習の質とスピードが上がる',
      '学校・塾の宿題もその場で解決'
    ],
    practicalFeatures: [
      { title: '画像で質問', description: '問題用紙やノートを撮って送るだけ。読み取り後すぐに解説が届きます', icon: 'MessageCircle' },
      { title: '要点タグ', description: '重要・暗記・要確認をメモ感覚でタグ付け。後から見返して復習に活用', icon: 'List' },
      { title: '自動レポート', description: 'タグを集めて要点レポートを自動生成。テスト前の総まとめに最適', icon: 'Download' },
      { title: '履歴の整理', description: 'スレッドごとにテーマを分けて管理。途中からでもすぐ再開できます', icon: 'Settings' }
    ],
    userFlow: [
      { step: 1, title: '写真 or テキストで質問', description: '解きたい問題を撮影、または文章で入力して送信' },
      { step: 2, title: '読み取り→理解', description: 'AIが内容を読み取り、つまずきそうな所を優先して説明' },
      { step: 3, title: '段階的に解説', description: 'ヒント→考え方→手順→答えの順番で噛み砕いて説明' },
      { step: 4, title: '要点をタグ付け', description: '重要・暗記・要確認のタグで復習ポイントを明確化' },
      { step: 5, title: 'レポートでまとめ', description: 'タグから自動レポートを作成し、テスト前の見直しに活用' }
    ]
  },
  {
    id: 'career-counselor',
    name: '進路カウンセラーAI',
    subtitle: '将来の目標設定をサポート（モバイルアプリ限定）',
    icon: Compass,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'purple',
    status: 'live',
    mobileOnly: true,
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

  const selected = useMemo(() => {
    return aiFeatures.find((f) => f.id === expandedFeature) || aiFeatures[0]
  }, [expandedFeature])
  const isPlannerSelected = selected.id === 'learning-planner'

  return (
    <section className="py-8 md:py-12 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 md:mb-3 font-bold">
            3つの専門AIコーチ
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            それぞれが異なる専門性を持ち、連携してあなたの学習を支援
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {aiFeatures.map((ai, index) => {
            const IconComponent = ai.icon
            const isExpanded = expandedFeature === ai.id
            const isLearningPlanner = ai.id === 'learning-planner'
            
            return (
              <div key={ai.id} className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                {/* ヘッダー（コンパクト） */}
                <button onClick={() => setExpandedFeature(ai.id)} className={`w-full text-left bg-gradient-to-r ${ai.color} p-4 md:p-5 text-white`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold truncate">{ai.name}</h3>
                      <p className="text-xs md:text-sm opacity-90 truncate">{ai.subtitle}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {ai.status === 'live' && (
                          <span className="inline-flex items-center bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold">利用できます</span>
                        )}
                        {ai.mobileOnly && (
                          <span className="inline-flex items-center bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] md:text-[11px]">モバイルアプリ限定</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* サマリー（短め） */}
                <div className="p-4 md:p-5">
                  <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4">{ai.description}</p>
                  <div className="space-y-2">
                    {(ai.features || []).slice(0, 4).map((feature, idx) => (
                      <div key={idx} className={`flex items-start space-x-2 p-2 bg-${ai.bgColor}-50 rounded-lg`}>
                        <div className={`w-1.5 h-1.5 bg-${ai.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                        <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 md:mt-4 flex justify-end">
                    <button onClick={() => setExpandedFeature(ai.id)} className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      詳しく見る <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
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

                {/* モバイル詳細（デスクトップでは非表示） */}
                <div className="md:hidden">
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                      <div className="p-4 md:p-8">
                        {/* 学習プランナーAIの詳細 */}
                        {isLearningPlanner && (
                          <div className="space-y-6 md:space-y-12">
                            {/* 実装済み機能 */}
                            <div>
                              <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-500" />
                                実装済み機能
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {ai.practicalFeatures?.map((feature, idx) => {
                                  const iconMap = {
                                    MessageCircle: MessageCircle,
                                    List: List,
                                    Settings: Settings,
                                    BarChart: BarChart,
                                    Download: Download,
                                    RefreshCw: RefreshCw
                                  }
                                  const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle
                                  return (
                                    <div key={idx} className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
                                      <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <div className="text-gray-900 font-semibold text-sm md:text-base">{feature.title}</div>
                                        <div className="text-gray-600 text-xs md:text-sm mt-1">{feature.description}</div>
                                      </div>
                                    </div>
                                  )
                                })}
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
                              <div className="mt-4 md:mt-6 text-center space-y-3">
                                <Link
                                  href="/diagnosis/types"
                                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm md:text-base"
                                >
                                  6つの学習タイプについて詳しく
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                                </Link>
                                <div className="pt-2">
                                  <Link
                                    href="/lival-agent-mode/threads/planner"
                                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm md:text-base transition-colors"
                                  >
                                    プランナーAIを体験する
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                                  </Link>
                                </div>
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

                        {/* 開発中表示（WIP のみ） */}
                        {!isLearningPlanner && (ai as any).status === 'wip' && (
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
                </div>

                {/* デスクトップでは常に表示 */}
                <div className="hidden">
                  <div className="p-8">
                    {/* 学習プランナーAIの詳細 */}
                    {isLearningPlanner && (
                      <div className="space-y-12">
                        {/* 実装済み機能 */}
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                            実装済み機能
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ai.practicalFeatures?.map((feature, idx) => {
                              const iconMap = {
                                MessageCircle: MessageCircle,
                                List: List,
                                Settings: Settings,
                                BarChart: BarChart,
                                Download: Download,
                                RefreshCw: RefreshCw
                              }
                              const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle
                              return (
                                <div key={idx} className="flex items-start space-x-4 p-6 bg-blue-50 rounded-xl">
                                  <IconComponent className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="text-gray-900 font-bold text-lg mb-2">{feature.title}</div>
                                    <div className="text-gray-600 text-sm leading-relaxed">{feature.description}</div>
                                  </div>
                                </div>
                              )
                            })}
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
                          <div className="mt-6 text-center space-y-4">
                            <Link
                              href="/diagnosis/types"
                              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                            >
                              6つの学習タイプについて詳しく
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <div>
                              <Link
                                href="/lival-agent-mode/threads/planner"
                                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg"
                              >
                                プランナーAIを体験する
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </div>
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

                    {/* 開発中表示（WIP のみ） */}
                    {!isLearningPlanner && (ai as any).status === 'wip' && (
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
        {/* デスクトップ詳細パネル（選択されたAIのみ表示） */}
        <div className="hidden md:block mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {isPlannerSelected ? (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> 実装済み機能
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selected.practicalFeatures?.map((feature: any, idx: number) => {
                          const iconMap = { MessageCircle, List, Settings, BarChart, Download, RefreshCw }
                          const IconComponent = (iconMap as any)[feature.icon] || CheckCircle
                          return (
                            <div key={idx} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                              <IconComponent className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-gray-900 font-semibold">{feature.title}</div>
                                <div className="text-gray-600 text-sm mt-1">{feature.description}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <ArrowRight className="w-5 h-5 mr-2 text-blue-500" /> ユーザー体験の流れ
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selected.userFlow?.map((flow: any, idx: number) => (
                          <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {flow.step}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-gray-900">{flow.title}</h5>
                              <p className="text-gray-600 text-sm">{flow.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-500" /> 6つの性格タイプ別アプローチ
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selected.personalizations?.map((person: any, idx: number) => (
                          <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <h5 className="font-bold text-gray-900 text-sm">{person.type}</h5>
                              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">{person.approach}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{person.example}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 text-center space-y-3">
                        <Link href="/diagnosis/types" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium">
                          6つの学習タイプについて詳しく <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        <div>
                          <Link href="/lival-agent-mode/threads/planner" className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-semibold">
                            プランナーAIを体験する <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> 主要機能
                      </h4>
                      <div className="space-y-2">
                        {selected.features?.map((f: string, idx: number) => (
                          <div key={idx} className={`flex items-start space-x-3 p-3 bg-${(selected as any).bgColor}-50 rounded-lg`}>
                            <div className={`w-2 h-2 bg-${(selected as any).bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                            <span className="text-gray-700 text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" /> 期待される効果
                      </h4>
                      <div className="space-y-2">
                        {selected.benefits?.map((b: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{b}</span>
                          </div>
                        ))}
                      </div>

                      {(selected as any).status === 'wip' && (
                        <div className="mt-4">
                          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                            <MessageCircle className="w-4 h-4 mr-2" /> 現在開発中 - 近日公開予定
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </section>
  )
}
