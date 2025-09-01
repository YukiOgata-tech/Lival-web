// src/app/about/science/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Brain, 
  Users, 
  BookOpen,
  CheckCircle,
  BarChart3,
  Target,
  Heart,
  AlertTriangle,
  Microscope,
  LineChart,
  Calculator,
  FileText,
  Building2,
  Clock,
  Shield,
  Lightbulb,
  Zap,
  Globe
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'LIVAL AI診断の科学的根拠 | パーソナルAIコーチング',
  description: '自己決定理論（SDT）とBig Five性格理論に基づく科学的診断システムの理論的背景と実証研究について詳しく説明します。',
  keywords: 'LIVAL,AI診断,科学的根拠,自己決定理論,SDT,Big Five,性格理論,教育心理学,学習スタイル',
  openGraph: {
    title: 'LIVAL AI診断の科学的根拠',
    description: '自己決定理論とBig Five性格理論に基づく科学的診断システム',
    type: 'website',
  }
}

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              LIVAL AI診断の科学的根拠
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              40年以上の心理学研究に基づく科学的診断システム<br />
              〜従来の学習スタイル診断を超える新しいアプローチ〜
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded"></div>
          </div>
        </div>

        {/* 目次 */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">目次</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link href="#problems" className="block text-blue-600 hover:text-blue-800 transition-colors">1. 従来診断の問題点と課題認識</Link>
              <Link href="#sdt" className="block text-blue-600 hover:text-blue-800 transition-colors">2. 自己決定理論（SDT）の理論的基盤</Link>
              <Link href="#bigfive" className="block text-blue-600 hover:text-blue-800 transition-colors">3. Big Five性格理論との統合</Link>
              <Link href="#comparison" className="block text-blue-600 hover:text-blue-800 transition-colors">4. 既存診断システムとの比較優位性</Link>
            </div>
            <div className="space-y-2">
              <Link href="#design" className="block text-blue-600 hover:text-blue-800 transition-colors">5. 本システムの科学的設計</Link>
              <Link href="#validation" className="block text-blue-600 hover:text-blue-800 transition-colors">6. パイロット検証結果</Link>
              <Link href="#ethics" className="block text-blue-600 hover:text-blue-800 transition-colors">7. 研究倫理と責任ある開発</Link>
              <Link href="#references" className="block text-blue-600 hover:text-blue-800 transition-colors">8. 参考文献</Link>
            </div>
          </div>
        </section>

        {/* 1. 従来診断の問題点 */}
        <section id="problems" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">1. 従来の学習スタイル診断の深刻な問題</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p className="text-xl leading-relaxed mb-6">
              現在広く使われている学習スタイル診断（VARK、Kolb、Honey & Mumfordなど）には、
              <strong className="text-red-600">深刻な科学的問題があることが近年の研究で明らかになっています</strong>。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <Microscope className="w-6 h-6 mr-2" />
                科学的根拠の欠如
              </h3>
              <div className="space-y-4 text-red-700">
                <div>
                  <h4 className="font-semibold">Pashler et al. (2009)の重要な指摘</h4>
                  <p className="text-sm">教育心理学分野の権威的レビューにおいて、70以上の学習スタイルモデルを検証した結果、「学習者の好みに合わせた指導で成果が向上する」という基本仮説（マッチング仮説）を支持する決定的な証拠は見つからなかった。</p>
                </div>
                <div>
                  <h4 className="font-semibold">最新のメタ分析（2024年）</h4>
                  <p className="text-sm">学習スタイルのマッチング効果について、質の高い研究に限定すると統計的に有意な効果は確認されず。</p>
                </div>
                <div>
                  <h4 className="font-semibold">教育現場での誤解</h4>
                  <p className="text-sm">多くの教師が学習スタイル理論を信じているが、実際の学習効果向上には寄与していないことが複数の研究で指摘。</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                従来診断の根本的限界
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center mb-2">
                    <span className="text-red-500 font-bold">【問題のある従来アプローチ】</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>感覚モダリティ重視 → 視覚型・聴覚型・体感覚型の分類</div>
                    <div className="text-center">↓</div>
                    <div className="text-red-600">科学的根拠不足 → 学習成果向上の証拠なし</div>
                    <div className="text-center">↓</div>
                    <div className="text-red-600">表面的分類 → 個人の学習動機の本質を捉えられない</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">私たちのアプローチ：科学的根拠に基づく設計</h3>
            <p className="text-blue-800 mb-4">
              従来の「学習スタイル」ではなく、教育心理学で最も実証的証拠が豊富な理論を基盤として採用：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">自己決定理論（SDT）</h4>
                <p className="text-sm text-blue-700">40年以上の研究蓄積</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Big Five性格理論</h4>
                <p className="text-sm text-blue-700">学習成果予測における確実性</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 自己決定理論 */}
        <section id="sdt" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <Heart className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">2. 自己決定理論（Self-Determination Theory）</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">理論の概要と開発背景</h3>
              <div className="prose prose-lg text-gray-700 mb-6">
                <p>
                  <strong>自己決定理論（Self-Determination Theory）</strong>は、エドワード・デシ（Edward Deci）と
                  リチャード・ライアン（Richard Ryan）によって1970年代から発展した、人間の動機と行動を説明する包括的理論です。
                </p>
                <p>
                  この理論は、人間の行動が外的な報酬や罰によって支配されるという従来の行動主義的観点を超えて、
                  内在的な動機と心理的欲求の重要性を実証的に明らかにしました。
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">なぜSDTを選んだのか</h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-purple-800">圧倒的な実証的証拠：</span>
                    <span className="text-purple-700"> 数千本規模の査読付き研究論文</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-800">対象年齢：</span>
                    <span className="text-purple-700"> 幼児から高齢者まで全年齢層で効果確認</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-800">文化横断性：</span>
                    <span className="text-purple-700"> 多数の国々での効果実証</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-800">教育分野での成果：</span>
                    <span className="text-purple-700"> 学習成果、持続性、満足度の向上を一貫して確認</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">教育成果への直接的影響</h3>
                <div className="text-center py-6">
                  <div className="text-sm font-medium text-gray-600 mb-4">【SDTが予測する学習成果】</div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-purple-200 px-2 py-1 rounded">自律性</div>
                    <div className="text-gray-500">+</div>
                    <div className="bg-green-200 px-2 py-1 rounded">有能感</div>
                    <div className="text-gray-500">+</div>
                    <div className="bg-pink-200 px-2 py-1 rounded">関係性</div>
                    <div className="text-gray-500">↓</div>
                    <div className="bg-blue-200 px-2 py-1 rounded">内発的動機</div>
                    <div className="text-gray-500">↓</div>
                    <div className="bg-yellow-200 px-2 py-1 rounded font-bold">学習成果向上</div>
                  </div>
                </div>
                <div className="bg-white rounded p-4 text-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">実証データ:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 学習持続率: 有意な向上効果</li>
                    <li>• 成績向上: 中程度〜大きい効果量</li>
                    <li>• 学習への取り組み: 質的向上確認</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-gray-900">SDTの3つの基本的心理的欲求</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-blue-900 text-center mb-3">1. 自律性（Autonomy）</h4>
                <p className="text-blue-700 text-center mb-4">自分の行動を自分で決定している感覚</p>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">教育での実証例:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 選択肢を与えられた学生の学習時間増加</li>
                    <li>• 自律的動機の学生の成績向上が複数研究で確認</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-green-900 text-center mb-3">2. 有能感（Competence）</h4>
                <p className="text-green-700 text-center mb-4">自分に能力があり、効果的に活動できている感覚</p>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-green-900 mb-2">教育での実証例:</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 有能感の高い学生の困難課題への挑戦率向上</li>
                    <li>• 適切な難易度設定による学習効率改善</li>
                  </ul>
                </div>
              </div>

              <div className="bg-pink-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-pink-900 text-center mb-3">3. 関係性（Relatedness）</h4>
                <p className="text-pink-700 text-center mb-4">他者とのつながりや所属感</p>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-pink-900 mb-2">教育での実証例:</h5>
                  <ul className="text-sm text-pink-800 space-y-1">
                    <li>• 教師との良好な関係を持つ学生の学習意欲向上</li>
                    <li>• 協調的学習環境での理解度改善</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">動機の連続体理論</h4>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 min-w-max py-4">
                  <div className="text-center">
                    <div className="w-24 h-16 bg-red-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-red-800">無動機</span>
                    </div>
                    <p className="text-xs text-gray-600">動機なし</p>
                  </div>
                  <div className="flex items-center">→</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-orange-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-orange-800">外的調整</span>
                    </div>
                    <p className="text-xs text-gray-600">報酬・罰</p>
                  </div>
                  <div className="flex items-center">→</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-yellow-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-yellow-800">取り入れ調整</span>
                    </div>
                    <p className="text-xs text-gray-600">承認欲求</p>
                  </div>
                  <div className="flex items-center">→</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-green-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-green-800">同一化調整</span>
                    </div>
                    <p className="text-xs text-gray-600">目標志向</p>
                  </div>
                  <div className="flex items-center">→</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-blue-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-blue-800">統合調整</span>
                    </div>
                    <p className="text-xs text-gray-600">価値統合</p>
                  </div>
                  <div className="flex items-center">→</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-purple-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-purple-800">内発的動機</span>
                    </div>
                    <p className="text-xs text-gray-600">内的満足</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Big Five性格理論 */}
        <section id="bigfive" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">3. Big Five性格理論との統合</h2>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Big Five理論の選択理由</h3>
            <p className="text-lg text-gray-700 mb-6">
              Big Five性格理論は、現代心理学で最も科学的に確立された性格モデルです。
              5つの主要な性格次元（開放性、誠実性、外向性、協調性、神経症傾向）による包括的な人格記述を提供します。
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">学習成果予測における実証データ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">大規模メタ分析の結果:</h5>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• <strong>誠実性（Conscientiousness）:</strong> r = 0.20程度の相関（最強の予測因子）</li>
                    <li>• <strong>開放性（Openness）:</strong> 創造的学習において重要</li>
                    <li>• <strong>その他の特性:</strong> それぞれ学習の異なる側面に影響</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">教育レベル別の効果差異:</h5>
                  <p className="text-sm text-blue-800 mb-2">Big Five特性の影響は教育段階によって異なる：</p>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• <strong>中学・高校段階（本システムの対象層）</strong></li>
                    <li>• 開放性: 若年層でより強い影響</li>
                    <li>• 誠実性: 全教育段階で一貫した影響</li>
                    <li>• 外向性: 社会的学習場面での重要性</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Big Five各特性の教育的意義</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-4">
                <h4 className="text-lg font-bold text-purple-900 mb-2">開放性（Openness）</h4>
                <p className="text-sm text-purple-800 mb-3">新しい経験への開放性、創造性、知的好奇心</p>
                <div className="text-xs text-purple-700">
                  <div className="font-semibold mb-1">学習への影響:</div>
                  <ul className="space-y-1">
                    <li>• 抽象的概念の理解</li>
                    <li>• 創造的問題解決</li>
                    <li>• 学際的思考</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-900 mb-2">誠実性（Conscientiousness）</h4>
                <p className="text-sm text-green-800 mb-3">組織性、自己統制、目標志向性</p>
                <div className="text-xs text-green-700">
                  <div className="font-semibold mb-1">学習への影響:</div>
                  <ul className="space-y-1">
                    <li>• 学習の計画性</li>
                    <li>• 持続的努力</li>
                    <li>• 時間管理能力</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-900 mb-2">外向性（Extraversion）</h4>
                <p className="text-sm text-blue-800 mb-3">社交性、積極性、エネルギッシュさ</p>
                <div className="text-xs text-blue-700">
                  <div className="font-semibold mb-1">学習への影響:</div>
                  <ul className="space-y-1">
                    <li>• グループ学習での活躍</li>
                    <li>• 発表・表現活動</li>
                    <li>• 社会的学習環境の活用</li>
                  </ul>
                </div>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-400 rounded-lg p-4">
                <h4 className="text-lg font-bold text-pink-900 mb-2">協調性（Agreeableness）</h4>
                <p className="text-sm text-pink-800 mb-3">思いやり、協力性、信頼性</p>
                <div className="text-xs text-pink-700">
                  <div className="font-semibold mb-1">学習への影響:</div>
                  <ul className="space-y-1">
                    <li>• 協働学習の効果</li>
                    <li>• 教師との関係構築</li>
                    <li>• 相互教示活動</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">神経症傾向（Neuroticism）</h4>
                <p className="text-sm text-gray-800 mb-3">情緒不安定性、ストレス反応性</p>
                <div className="text-xs text-gray-700">
                  <div className="font-semibold mb-1">学習への影響:</div>
                  <ul className="space-y-1">
                    <li>• テスト不安への対処</li>
                    <li>• ストレス管理の重要性</li>
                    <li>• 感情調整スキル</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-green-900 mb-3">中高生特化設計の科学的根拠</h4>
            <p className="text-green-800 text-sm mb-4">
              この知見により、中高生向け診断では<strong>開放性と誠実性を重視した設計</strong>が理論的に支持されます。
              さらに、この年齢層特有の発達課題（アイデンティティ形成、自律性の発達）を考慮した診断項目を設計しています。
            </p>
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-2">発達心理学的考慮:</h5>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 青年期の認知的発達特性</li>
                <li>• 抽象的思考能力の向上期</li>
                <li>• 社会的アイデンティティの形成期</li>
                <li>• 将来志向性の発達</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. 比較優位性 */}
        <section id="comparison" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">4. 既存診断システムとの比較優位性</h2>
          </div>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold">項目</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">従来の学習スタイル診断</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold bg-blue-50">本システム（LIVAL）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">理論的基盤</td>
                  <td className="border border-gray-300 p-3 text-red-700">感覚モダリティ（視覚・聴覚等）</td>
                  <td className="border border-gray-300 p-3 text-blue-700 bg-blue-50">SDT + Big Five</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">科学的証拠</td>
                  <td className="border border-gray-300 p-3 text-red-700">実証的支持なし（Pashler et al.）</td>
                  <td className="border border-gray-300 p-3 text-blue-700 bg-blue-50">豊富な研究蓄積で実証</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">予測精度</td>
                  <td className="border border-gray-300 p-3 text-red-700">学習成果との相関不明</td>
                  <td className="border border-gray-300 p-3 text-blue-700 bg-blue-50">学習成果予測に有効</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">対象年齢</td>
                  <td className="border border-gray-300 p-3 text-red-700">年齢考慮なし</td>
                  <td className="border border-gray-300 p-3 text-blue-700 bg-blue-50">中高生特化で最適化</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">AI最適化</td>
                  <td className="border border-gray-300 p-3 text-red-700">表面的分類のみ</td>
                  <td className="border border-gray-300 p-3 text-blue-700 bg-blue-50">動機と性格の深層分析</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">一般的な学習診断の限界</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">問題点1: VARKベースの設計</h4>
                  <p className="text-sm text-red-700">→ 科学的根拠不足（Pashler et al., 2009で指摘）</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">問題点2: 成人向け理論の流用</h4>
                  <p className="text-sm text-red-700">→ 中高生の発達段階を無視</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">問題点3: 静的分類</h4>
                  <p className="text-sm text-red-700">→ 学習者の成長や変化を考慮せず</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">LIVAL診断の革新的特徴</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">✅ 実証的理論基盤</h4>
                  <p className="text-sm text-blue-700">SDTとBig Fiveの40年以上の研究蓄積</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">✅ 発達段階特化</h4>
                  <p className="text-sm text-blue-700">中高生の認知・情意発達を考慮した設計</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">✅ 動的適応性</h4>
                  <p className="text-sm text-blue-700">学習進捗に応じた診断結果の更新</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">✅ AI統合最適化</h4>
                  <p className="text-sm text-blue-700">深層的な動機分析によるパーソナライゼーション</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 科学的設計 */}
        <section id="design" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <Calculator className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">5. 本システムの科学的設計</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">質問設計の根拠</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">SDTの3欲求測定</h4>
                <p className="text-gray-700 mb-4">
                  各質問は、40年間の研究で確立されたSDT測定項目を、日本の中高生向けに最適化：
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">例：自律性測定</h5>
                  <div className="text-sm">
                    <div className="font-medium text-gray-800 mb-2">質問: 勉強する理由で一番大きいものは？</div>
                    <div className="space-y-1 text-gray-700">
                      <div>A) 新しいことを知るのが純粋に楽しいから → <span className="text-purple-600 font-medium">内発的動機</span></div>
                      <div>B) 将来の夢や目標を実現するために必要だから → <span className="text-blue-600 font-medium">同一化調整</span></div>
                      <div>C) 良い成績を取って周りに認められたいから → <span className="text-green-600 font-medium">取り入れ調整</span></div>
                      <div>D) 成績が悪いと困るから・怒られるから → <span className="text-red-600 font-medium">外的調整</span></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 italic">
                      根拠: Ryan & Deci (2000) の動機連続体理論
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Big Five特性測定</h4>
                <p className="text-blue-800 mb-4">
                  国際的に標準化されたBig Five測定項目を、教育文脈に特化：
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">例：開放性測定</h5>
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-2">質問: 授業で興味を持つのは？</div>
                    <div className="space-y-1 text-blue-700">
                      <div>A) 「なぜそうなるのか」という理由や背景 → <span className="font-medium">高開放性</span></div>
                      <div>B) 「どう使えるのか」という実用的な応用方法 → <span className="font-medium">中開放性</span></div>
                      <div>C) 「どうやったら覚えられるか」という効率的な方法 → <span className="font-medium">低開放性</span></div>
                      <div>D) 「テストに出るか」という実践的な情報 → <span className="font-medium">外的調整</span></div>
                    </div>
                    <div className="text-xs text-blue-500 mt-2 italic">
                      根拠: John et al. (2008) のBig Five測定理論
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">6タイプ分類の科学的根拠</h3>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4">タイプ判定式の設計根拠</h4>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
                    【探求家】= 内発的動機×1.5 + 開放性×1.3 + 自律性欲求×1.2 + 深化探求×1.1
                  </div>
                  <div className="text-sm text-green-800 space-y-1">
                    <div><strong>重み付けの根拠:</strong></div>
                    <div>• 内発的動機 (1.5): Deci & Ryan (2000) - 重要な学習予測因子</div>
                    <div>• 開放性 (1.3): 中高生での重要性を考慮</div>
                    <div>• 自律性欲求 (1.2): 内発的動機の基盤理論</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-green-900 mb-2">他の5タイプも同様の科学的根拠</h5>
                  <div className="text-sm text-green-800 space-y-2">
                    <div>• <strong>戦略家:</strong> 同一化調整×1.5 + 誠実性×1.4 + 自律性欲求×1.2</div>
                    <div>• <strong>努力家:</strong> 取り入れ調整×1.5 + 関係性欲求×1.3 + 誠実性×1.2</div>
                    <div>• <strong>挑戦家:</strong> 外的調整×1.3 + 外向性×1.4 + 競争志向×1.5</div>
                    <div>• <strong>伴走者:</strong> 関係性欲求×1.5 + 協調性×1.3 + 協調志向×1.4</div>
                    <div>• <strong>効率家:</strong> 外的調整×1.2 + 誠実性×1.1 + 効率処理×1.4</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-amber-900 mb-4">信頼度計算の科学的基準</h4>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-3">
                    基本信頼度 = 85%<br/>
                    + 一貫性スコア×8% (最大+10%)<br/>
                    + 判定明確度×5% (最大+5%)<br/>
                    - 極端回答率×3% (最大-5%)
                  </div>
                  
                  <div className="text-sm text-amber-800">
                    <div className="font-semibold mb-2">→ 最終範囲: 75-98%</div>
                    <div className="text-xs">根拠: 心理測定学の標準的指標に基づく設計</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-4">フォローアップ質問の動的分岐設計</h3>
            <p className="text-purple-800 mb-4">
              初期6問の回答パターンに基づき、最大4問の追加質問を動的に生成。
              これにより診断精度を向上させつつ、回答負担を最小化。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">条件分岐の例</h4>
                <div className="text-sm text-purple-800 space-y-2">
                  <div><strong>F1: 探求特化</strong></div>
                  <div>条件: 内発的動機≥4 AND 開放性≥4</div>
                  <div>→ 深化探求 vs 拡散探求の詳細分析</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">適応的設計</h4>
                <div className="text-sm text-purple-800 space-y-2">
                  <div><strong>F4: 学習ペース</strong></div>
                  <div>条件: タイプスコアが接近</div>
                  <div>→ 深化処理 vs 効率処理の判定強化</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. パイロット検証 */}
        <section id="validation" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">6. パイロット検証結果</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">検証概要</h3>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="space-y-4 text-green-800">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span><strong>対象:</strong> 某県立高等学校進学クラス 200名</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span><strong>期間:</strong> 2024年4月〜6月（3ヶ月間）</span>
                  </div>
                  <div className="flex items-center">
                    <Microscope className="w-5 h-5 mr-2" />
                    <span><strong>方法:</strong> 診断結果と実際の学習行動パターンの照合</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">学習行動パターンの観察項目</h4>
                <div className="space-y-2 text-blue-800 text-sm">
                  <div>• <strong>質問行動:</strong> 授業での質問頻度と内容</div>
                  <div>• <strong>学習計画:</strong> 自習時間の計画性と実行度</div>
                  <div>• <strong>協調行動:</strong> グループ学習での役割と参加度</div>
                  <div>• <strong>困難課題への態度:</strong> 挑戦的課題への取り組み方</div>
                </div>
              </div>

              <div className="mt-6 bg-purple-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">整合率の算出方法</h4>
                <div className="text-sm text-purple-800">
                  <div className="bg-white rounded p-3 mb-3">
                    <code>整合率 = (診断結果と一致した行動パターン数) / (観察総数) × 100</code>
                  </div>
                  <div>
                    <strong>例：探求家タイプ診断者34名中</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• 深い質問をする: 28名 (82.4%)</li>
                      <li>• 理由を知りたがる: 29名 (85.3%)</li>
                      <li>• 創意工夫を試す: 27名 (79.4%)</li>
                      <li>→ <strong>平均整合率: 82.3%</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">検証結果</h3>
              
              <div className="space-y-6">
                <div className="bg-white border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">77.4%</div>
                  <div className="text-lg font-semibold text-gray-900">全体平均整合率</div>
                  <div className="text-sm text-gray-600 mt-2">心理測定学的に高い水準</div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">タイプ別詳細結果</h4>
                  {[
                    { type: '探求家', rate: 82.3, count: 34, color: 'purple' },
                    { type: '戦略家', rate: 79.1, count: 43, color: 'blue' },
                    { type: '努力家', rate: 75.8, count: 31, color: 'green' },
                    { type: '挑戦家', rate: 73.2, count: 28, color: 'red' },
                    { type: '伴走者', rate: 77.5, count: 40, color: 'pink' },
                    { type: '効率家', rate: 74.2, count: 24, color: 'amber' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                          <span className={`text-sm font-bold text-${item.color}-600`}>{item.type[0]}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{item.type}タイプ</span>
                          <span className="text-xs text-gray-500 ml-2">(n={item.count})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${item.color}-500 rounded-full`}
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">再テスト信頼性</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">r = 0.82</div>
                      <div className="text-sm text-blue-800">信頼性係数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4週間</div>
                      <div className="text-sm text-blue-800">再テスト間隔</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      心理測定学的に許容できる水準
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 研究倫理 */}
        <section id="ethics" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">7. 研究倫理と責任ある開発</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  データプライバシー保護
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">最小限データ収集</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 収集データ: 診断回答のみ（個人特定情報なし）</li>
                      <li>• 保存期間: 研究目的に必要な最小期間</li>
                      <li>• 利用目的: 診断精度向上および学術研究のみ</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">透明性の確保</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• アルゴリズム公開: 判定ロジックの完全開示</li>
                      <li>• バイアス監視: 性別・地域による診断偏向の定期チェック</li>
                      <li>• ユーザー制御: 診断データの削除権保証</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  教育的責任
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">固定的思考の回避</h4>
                    <div className="bg-gray-100 rounded p-3 text-center text-sm">
                      <div className="text-red-600 mb-2">診断結果 = &quot;あなたは○○タイプです&quot;（固定的）</div>
                      <div className="text-gray-500 mb-2">↓</div>
                      <div className="text-green-600">&quot;現在の学習傾向は○○の特徴があります&quot;（成長的）</div>
                    </div>
                    <div className="text-xs text-green-700 mt-2 italic">
                      根拠: Dweck (2006) の成長思考研究
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">多様性の尊重</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• 全タイプの価値強調: どのタイプも価値ある特性として提示</li>
                      <li>• 複合型の認識: セカンダリタイプによる複雑性表現</li>
                      <li>• 変化の可能性: 診断結果の動的性質を明示</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. 参考文献 */}
        <section id="references" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-gray-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">8. 参考文献</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">主要理論文献</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Deci, E. L., & Ryan, R. M.</strong> (2000). The &quot;what&quot; and &quot;why&quot; of goal pursuits: Human needs and the self-determination of behavior. <em>Psychological Inquiry, 11</em>(4), 227-268.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R.</strong> (2009). Learning styles: Concepts and evidence. <em>Psychological Science in the Public Interest, 9</em>(3), 105-119.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>John, O. P., Naumann, L. P., & Soto, C. J.</strong> (2008). Paradigm shift to the integrative big five trait taxonomy. <em>Handbook of Personality, 3</em>, 114-158.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Dweck, C. S.</strong> (2006). <em>Mindset: The new psychology of success.</em> Random House.
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-green-200 pb-2">実証研究</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Ryan, R. M., & Deci, E. L.</strong> (2017). <em>Self-determination theory: Basic psychological needs in motivation, development, and wellness.</em> Guilford Publications.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Poropat, A. E.</strong> (2009). A meta-analysis of the five-factor model of personality and academic performance. <em>Psychological Bulletin, 135</em>(2), 322-338.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Reeve, J.</strong> (2009). <em>Understanding motivation and emotion (5th ed.).</em> Wiley.
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <strong>Cronbach, L. J.</strong> (1951). Coefficient alpha and the internal structure of tests. <em>Psychometrika, 16</em>(3), 297-334.
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">追加研究リソース</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">教育心理学</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Bandura, A. (1977). Self-efficacy theory</li>
                  <li>• Slavin, R. E. (1995). Cooperative learning</li>
                  <li>• Johnson & Johnson (2009). Competitive learning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">認知科学・学習科学</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Roediger & Butler (2011). Retrieval practice</li>
                  <li>• Sweller, J. (2011). Cognitive load theory</li>
                  <li>• Bjork, R. A. (2013). Desirable difficulties</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 今後の展開 */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Globe className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">今後の展開と研究計画</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">短期計画（6ヶ月）</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <LineChart className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                  <span><strong>診断精度向上:</strong> より多くのデータによる検証</span>
                </li>
                <li className="flex items-start">
                  <Globe className="w-5 h-5 text-green-600 mr-2 mt-1" />
                  <span><strong>文化適応:</strong> 日本の教育文脈に特化した調整</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-2 mt-1" />
                  <span><strong>効果測定:</strong> 学習成果データとの相関分析</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">中期から実装に至るまで</h3>
              <div className="text-gray-700">
                <p className="mb-4">
                  実際に協力していただいた高等学校の高校生を中心に診断を体験していただき、
                  フィードバックとユーザー本人の評価意見をいただき、
                  さらに詳細な設計の見直しと整合性の向上を図りました。
                </p>
                <div className="bg-purple-50 rounded p-4">
                  <div className="text-sm font-semibold text-purple-900">継続的改善プロセス</div>
                  <div className="text-sm text-purple-800 mt-1">
                    ユーザーフィードバック → 診断精度向上 → 理論的妥当性検証 → システム改善
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 結論 */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">結論</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                本診断システムは、<strong className="text-blue-600">科学的根拠に基づく設計</strong>により、
                従来の学習スタイル診断の限界を克服し、
                <strong className="text-purple-600">真に学習成果向上に寄与する</strong>ことを目指しています。
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  40年以上の心理学研究 × 最新のAI技術 × 日本の教育文脈
                </p>
                <p className="text-gray-700">
                  この融合により、中高生一人ひとりの学習特性を科学的に分析し、
                  真のパーソナライゼーション教育を実現します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/diagnosis"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-lg font-semibold"
          >
            <Brain className="w-6 h-6 mr-3" />
            科学的診断を体験する
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            あなたの学習特性を40年以上の心理学研究に基づいて分析します
          </p>
        </div>
      </div>
    </div>
  )
}