// src/app/diagnosis/types/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap, 
  Users, 
  Settings,
  Heart,
  Lightbulb,
  Rocket,
  UserCheck,
  Clock,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: '6つの学習タイプ詳細 | Lival AI診断',
  description: 'Lival AIが識別する6つの学習タイプの詳細説明。探求家、戦略家、努力家、挑戦家、伴走者、効率家の特徴とAIコーチング手法について。',
  keywords: 'Lival AI,学習タイプ,診断,探求家,戦略家,努力家,挑戦家,伴走者,効率家',
  openGraph: {
    title: '6つの学習タイプ詳細 | Lival AI',
    description: '科学的根拠に基づく6つの学習タイプの詳細説明',
    type: 'website',
  }
}

const learningTypes = [
  {
    id: 'explorer',
    name: '探求家',
    subtitle: '内発的探求者',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'purple',
    description: '純粋な知的好奇心によって学習が駆動されるタイプ',
    detailedDescription: '新しいことを知る喜び、発見の興奮、深い理解への欲求が学習の原動力となります。「なぜ？」「どうして？」という根本的な疑問を大切にし、学習内容の背景や理論的根拠を重視します。',
    characteristics: [
      '純粋な知的好奇心が学習の原動力',
      '「なぜ」という根本的な問いを重視',
      '新しい概念や理論への強い興味',
      '学習内容の深い理解を求める',
      '創造的思考と独創的なアプローチを好む',
      '学習過程そのものに喜びを見出す'
    ],
    strengths: [
      '困難な概念でも粘り強く理解しようとする',
      '異なる分野の知識を統合的に理解できる',
      '創造的で独創的な解決策を見つけられる',
      '長期的な学習継続力が高い'
    ],
    aiCoaching: {
      style: '知的ガイド型',
      approach: '概念の背景や理論的根拠を詳しく説明し、発見的学習をサポート',
      example: '「面白い視点だね。もし〇〇だったらどうなると思う？」'
    },
    studyTips: [
      '学習内容を他の分野と関連付けて考える',
      '「なぜこうなるのか」を常に問いかける',
      '概念マップや図解を活用した理解の整理',
      '興味のある分野から関連領域へ学習を広げる'
    ]
  },
  {
    id: 'strategist',
    name: '戦略家',
    subtitle: '目標志向戦略家',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'blue',
    description: '明確な目標設定と計画的な学習進行を重視するタイプ',
    detailedDescription: '将来の目標達成への強い意識を持ち、体系的で論理的な思考プロセスで学習に取り組みます。効果的な時間管理と優先順位設定を得意とし、段階的なスキル構築を重視します。',
    characteristics: [
      '明確な目標設定と計画的な学習進行',
      '体系的で論理的な思考プロセス',
      '効果的な時間管理と優先順位設定',
      '段階的なスキル構築への意識',
      'データや証拠に基づく判断を重視',
      '長期的視点での学習戦略策定'
    ],
    strengths: [
      '効率的で計画的な学習進行',
      '目標達成への強いコミット力',
      '体系的な知識整理と活用',
      '時間管理と優先順位設定の巧みさ'
    ],
    aiCoaching: {
      style: '論理的パートナー型',
      approach: '学習内容の全体構造と段階的な進行プロセスを明確に提示',
      example: '「まず全体の構造を整理してから、段階的に進めていこう」'
    },
    studyTips: [
      '学習内容を体系的に整理し、マップ化する',
      'SMART目標（具体的、測定可能、達成可能）を設定',
      '定期的な進捗確認と計画の修正',
      '複雑な問題を段階的に分解して取り組む'
    ]
  },
  {
    id: 'achiever',
    name: '努力家',
    subtitle: '承認欲求努力家',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'green',
    description: '他者からの承認と評価を重視し、努力を大切にするタイプ',
    detailedDescription: '教師や保護者、仲間からの承認が学習の大きな動機となります。努力と頑張りを大切にする価値観を持ち、成績向上への強い意識と責任感のある学習態度を示します。',
    characteristics: [
      '他者からの承認と評価を重視する傾向',
      '努力と頑張りを大切にする価値観',
      '成績向上への強い意識と取り組み',
      '教師や保護者との良好な関係を求める',
      '協力的で責任感の強い学習態度',
      '成果を通じた自己価値の確認'
    ],
    strengths: [
      '努力を継続する意志力',
      '責任感と協調性',
      '他者への配慮と思いやり',
      '基礎的なスキルの着実な習得'
    ],
    aiCoaching: {
      style: '励ましコーチ型',
      approach: '努力と成長を積極的に承認し、段階的な目標設定で成功体験を積み重ね',
      example: '「すごい！よく頑張ったね。この調子で次のステップに進もう」'
    },
    studyTips: [
      '小さな達成目標を設定し、成功体験を積む',
      '学習成果を他者と共有し、フィードバックを求める',
      '努力の過程も含めて自己評価する',
      'グループ学習で協働する機会を増やす'
    ]
  },
  {
    id: 'challenger',
    name: '挑戦家',
    subtitle: '競争志向挑戦家',
    icon: Zap,
    color: 'from-red-500 to-orange-500',
    bgColor: 'red',
    description: '競争的な環境でのモチベーションとスピード感を重視するタイプ',
    detailedDescription: '他者との競争や勝利の喜びが学習の原動力となります。スピード感のある学習進行を好み、挑戦的な課題に積極的に取り組む特性を持ちます。短期的な成果への強い関心を示します。',
    characteristics: [
      '競争的な環境での高いモチベーション',
      'スピード感のある学習進行を好む',
      '挑戦的な課題への積極的な取り組み',
      '他者との比較による自己評価',
      '短期的な成果への強い関心',
      'エネルギッシュで活動的な学習スタイル'
    ],
    strengths: [
      '高いエネルギーと集中力',
      '挑戦的課題への果敢な取り組み',
      '迅速な情報処理能力',
      '競争環境での力の発揮'
    ],
    aiCoaching: {
      style: '競争パートナー型',
      approach: 'ゲーミフィケーション要素を活用し、挑戦的な問題と競争的要素を適度に提供',
      example: '「今日はチャレンジ問題だよ。君なら解けるはず！」'
    },
    studyTips: [
      'タイムチャレンジや目標設定で競争的要素を活用',
      '短期的な成果目標と長期的な成長目標のバランス',
      '他者との切磋琢磨を通じた学習',
      '難易度の段階的向上で達成感を維持'
    ]
  },
  {
    id: 'companion',
    name: '伴走者',
    subtitle: '関係重視協調者',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'pink',
    description: '他者とのつながりを重視し、協力的な学習環境を好むタイプ',
    detailedDescription: '仲間との良好な関係と相互支援が学習の重要な要素となります。協力的で支え合いを大切にする価値観を持ち、安心できる環境でのグループ学習や共同作業で力を発揮します。',
    characteristics: [
      '他者とのつながりを重視する学習スタイル',
      '協力的で支え合いを大切にする価値観',
      '安心できる環境での高いパフォーマンス',
      'グループ学習や共同作業での力の発揮',
      '他者への思いやりと共感的な理解',
      '調和を重視するコミュニケーション'
    ],
    strengths: [
      '他者との効果的な協働',
      '共感力とコミュニケーション能力',
      'チームワークでの問題解決',
      '調和的な学習環境の構築'
    ],
    aiCoaching: {
      style: '共感メンター型',
      approach: '共感的で支援的な対話を重視し、協働的な学習機会を提供',
      example: '「大丈夫、一緒に頑張ろう。みんなで支え合って学習していこう」'
    },
    studyTips: [
      'スタディグループやペア学習の活用',
      '他者との意見交換で理解を深める',
      '互いに教え合う機会を作る',
      '学習の悩みや疑問を共有する'
    ]
  },
  {
    id: 'efficiency',
    name: '効率家',
    subtitle: '効率重視実用家',
    icon: Settings,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'amber',
    description: '効率性と実用性を重視し、最短経路での成果達成を目指すタイプ',
    detailedDescription: '学習の実用性と効率的な成果達成を最重視します。目的意識が明確で無駄を嫌い、短時間で最大効果を求める姿勢を持ちます。実践的で応用可能な知識への関心が高いのが特徴です。',
    characteristics: [
      '効率性と実用性を最重視する学習観',
      '目的意識が明確で無駄を嫌う傾向',
      '短時間で最大効果を求める姿勢',
      '実践的で応用可能な知識への関心',
      'システマティックな学習方法の採用',
      '成果と時間のコストパフォーマンス重視'
    ],
    strengths: [
      '効率的な学習方法の選択と実行',
      '目的に応じた優先順位設定',
      '時間管理と計画実行能力',
      '実践的な知識の応用力'
    ],
    aiCoaching: {
      style: '実務コンサルタント型',
      approach: '簡潔で実用的な指導を提供し、効率的な学習技術と実践的スキル習得に焦点',
      example: '「結論から言うと、この方法が最も効率的です」'
    },
    studyTips: [
      '学習目的を明確化し、必要な内容に絞る',
      '効果的な暗記法や復習法を活用',
      '過去問や実践問題を中心とした学習',
      '時間を区切った集中学習セッション'
    ]
  }
]

export default function DiagnosisTypesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-12">
          <Link 
            href="/diagnosis"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            診断画面に戻る
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lival AIが識別する
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                6つの学習タイプ
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              自己決定理論（SDT）とBig Five性格理論に基づく科学的分類により、
              あなたの学習特性を6つのタイプに分けて詳細に分析します。
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded"></div>
          </div>
        </div>

        {/* タイプ一覧 */}
        <div className="space-y-12">
          {learningTypes.map((type, index) => {
            const IconComponent = type.icon
            return (
              <div key={type.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* ヘッダー */}
                <div className={`bg-gradient-to-r ${type.color} p-8 text-white`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{type.name}</h2>
                      <p className="text-lg opacity-90">{type.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-lg opacity-95">{type.description}</p>
                </div>

                {/* コンテンツ */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左側：詳細説明と特徴 */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-red-500" />
                          このタイプの特徴
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {type.detailedDescription}
                        </p>
                        <div className="space-y-2">
                          {type.characteristics.map((characteristic, idx) => (
                            <div key={idx} className={`flex items-start space-x-2 p-2 bg-${type.bgColor}-50 rounded-lg`}>
                              <div className={`w-1.5 h-1.5 bg-${type.bgColor}-500 rounded-full mt-2 flex-shrink-0`}></div>
                              <span className="text-gray-700 text-sm">{characteristic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          あなたの強み
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {type.strengths.map((strength, idx) => (
                            <span 
                              key={idx} 
                              className={`px-3 py-1 bg-${type.bgColor}-100 text-${type.bgColor}-800 rounded-full text-sm font-medium`}
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 右側：AIコーチングとコツ */}
                    <div className="space-y-6">
                      <div className={`bg-gradient-to-br from-${type.bgColor}-50 to-${type.bgColor}-100 rounded-xl p-6`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                          <Rocket className="w-5 h-5 mr-2 text-blue-500" />
                          Lival AIコーチング
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white/80 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">コーチングスタイル</h4>
                            <p className="text-gray-700 text-sm">{type.aiCoaching.style}</p>
                          </div>
                          <div className="bg-white/80 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">アプローチ方法</h4>
                            <p className="text-gray-700 text-sm">{type.aiCoaching.approach}</p>
                          </div>
                          <div className="bg-white/80 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">AIからの声かけ例</h4>
                            <p className="text-gray-700 text-sm italic">「{type.aiCoaching.example}」</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                          効果的な学習のコツ
                        </h3>
                        <div className="space-y-2">
                          {type.studyTips.map((tip, idx) => (
                            <div key={idx} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 診断への誘導 */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              あなたはどのタイプ？
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              科学的診断で正確にあなたの学習タイプを判定し、
              最適なAIコーチング体験を提供します
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/diagnosis"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg"
              >
                <UserCheck className="w-6 h-6 mr-2" />
                無料診断を始める
              </Link>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                所要時間: 約5-8分
              </div>
            </div>
          </div>
        </div>

        {/* 科学的根拠へのリンク */}
        <div className="mt-12 text-center">
          <Link 
            href="/about/science"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>この分類の科学的根拠について詳しく</span>
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}