import { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  ChartBarBig,
  FileBarChart,
  Users,
  UserCog,
  MessageSquare,
  MessageCircleQuestion,
  ClipboardList,
  CalendarClock,
  BrainCircuit,
  Shield,
  Sparkles
} from 'lucide-react'
import FeatureSurvey from '@/components/enterprise/FeatureSurvey'

export const metadata: Metadata = {
  title: 'エンタープライズ版（塾・学校向け） | LIVAL AI',
  description:
    '塾・学校向けのエンタープライズ版。生徒のAI利用履歴を可視化・レポート化し、面談や学習指導の効率化を支援。学習記録管理やタスク配信、招待制グループセッション（AI活用/レポート化/講師チャット）を搭載。料金は要問合せ。順次開発・公開予定。',
  openGraph: {
    title: 'エンタープライズ版（塾・学校向け） | LIVAL AI',
    description:
      'AIで面談/指導を効率化。履歴の可視化・レポート、学習記録管理、タスク配信、グループセッション（AI活用/レポート化/講師チャット）を提供。料金は要問合せ。順次開発・公開予定。',
    type: 'website'
  }
}

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs sm:text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            <span>塾・学校向け エンタープライズ版</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            面談と指導を、AIでスマートに
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-lg max-w-3xl">
            生徒のAI利用履歴を可視化・レポート化して、面談や学習指導の準備を大幅に効率化。
            学習記録の管理やタスク配信、招待制のグループセッション機能まで、学校・塾の現場運用を一気通貫で支援します。
          </p>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              料金・導入のご相談（要問合せ）
            </Link>
            <div className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-3 text-gray-700 bg-white">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              順次開発・公開予定の機能を含みます
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <HighlightCard icon={<FileBarChart className="w-5 h-5" />} title="AI履歴の可視化/レポート">
            生徒のAI質問・進路相談の履歴を自動で整理し、個別シートとレポートに反映。
          </HighlightCard>
          <HighlightCard icon={<ClipboardList className="w-5 h-5" />} title="学習記録管理とタスク配信">
            学習記録の集計/分析に加え、教員側から課題・タスクを配信して進捗を管理。
          </HighlightCard>
          <HighlightCard icon={<Users className="w-5 h-5" />} title="招待制グループセッション">
            講師がルームをホストし、AI活用/セッションレポート/講師チャットまで一体提供。
          </HighlightCard>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <FeaturePanel
            badge="面談をもっとスムーズに"
            title="生徒のAI利用を1枚に集約"
            icon={ChartBarBig}
            points={[
              '質問/回答・進路相談の履歴を自動収集し、個票にタイムライン表示',
              '面談用に要点をまとめたレポートをワンクリックで生成',
              '気づき・次回アクションをメモして共有'
            ]}
          />

          <FeaturePanel
            badge="運用を一気通貫で"
            title="学習記録とタスクをまとめて管理"
            icon={UserCog}
            points={[
              '学習記録の収集/可視化で、日々の状況をクラス/個人で俯瞰',
              '課題・タスクを配信し、提出/進捗を管理（通知/リマインド）',
              '名簿・クラス・アカウント権限などの管理機能'
            ]}
            tone="emerald"
          />

          <FeaturePanel
            badge="協働学習をアップデート"
            title="招待制のオンライン学習スペース"
            icon={CalendarClock}
            points={[
              '講師がセッションを作成し、リンク招待で生徒が参加',
              'セッション中にAIチャットを併用して、理解を深掘り',
              '終了後はセッションレポートを自動作成し、復習にも活用'
            ]}
            tone="purple"
          />

          <FeaturePanel
            badge="AIを安全に活用"
            title="講師QAとAIのハイブリッド"
            icon={MessageSquare}
            points={[
              '講師に直接質問できるクラスチャットを搭載',
              'AIの提案と講師のコメントを並べて比較/検討',
              '校内ポリシーや年齢に配慮した安全設計'
            ]}
            tone="indigo"
          />
        </div>
      </section>

      {/* Value props */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <ValueCard icon={<Building2 className="w-5 h-5" />} title="小規模事業所に強く推奨">
            業務効率化によって、個別対応を強みにする小規模塾での価値提供を後押し。少数講師でも、面談・指導の質を落とさず運用できます。
          </ValueCard>
          <ValueCard icon={<BrainCircuit className="w-5 h-5" />} title="データで見える化">
            生徒の困りごとや興味の推移を把握し、次の一手を素早く決定。
          </ValueCard>
          <ValueCard icon={<Shield className="w-5 h-5" />} title="安心の運用設計">
            権限/名簿/記録の扱いに配慮した構成で、現場導入しやすい。
          </ValueCard>
          <ValueCard icon={<MessageCircleQuestion className="w-5 h-5" />} title="伴走サポート">
            導入相談から設計、トライアル運用まで担当が伴走します。
          </ValueCard>
        </div>
      </section>

  {/* CTA */}
  <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
              エンタープライズ版の料金は「要問合せ」です
            </h2>
            <p className="mt-2 text-gray-700 text-sm sm:text-base">
              学校・塾の運用に合わせて順次開発・公開予定です。まずは要件をお聞かせください。
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                お問い合わせ・デモ相談
              </Link>
              <Link
                href="/docs/study-log-system-specification"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-800 bg-white hover:bg-gray-50 transition-colors"
              >
                機能の技術資料を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Request Survey */}
      <FeatureSurvey />

      {/* Try First CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 p-6 sm:p-8 text-center text-white shadow-lg">
            <h2 className="text-xl sm:text-3xl font-bold">まずは機能を試してみる</h2>
            <p className="mt-2 text-sm sm:text-base opacity-90">
              無料アカウント作成と学習タイプ診断から、LIVAL AIの体験を始めましょう。
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-emerald-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                アカウントを作成する（無料）
              </Link>
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                学習タイプ診断を試す
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function HighlightCard({
  icon,
  title,
  children
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mt-0.5 text-blue-600">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-gray-600 text-sm mt-0.5">{children}</div>
      </div>
    </div>
  )
}

function FeaturePanel({
  badge,
  title,
  icon: Icon,
  points,
  tone = 'blue'
}: {
  badge: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  points: string[]
  tone?: 'blue' | 'emerald' | 'purple' | 'indigo'
}) {
  const toneClasses: Record<string, { ring: string; icon: string; badge: string }> = {
    blue: {
      ring: 'ring-blue-100 bg-blue-50',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    emerald: {
      ring: 'ring-emerald-100 bg-emerald-50',
      icon: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    purple: {
      ring: 'ring-purple-100 bg-purple-50',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    indigo: {
      ring: 'ring-indigo-100 bg-indigo-50',
      icon: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700'
    }
  }
  const t = toneClasses[tone]

  return (
    <div className={`rounded-2xl border border-gray-200 p-5 sm:p-6 ring-1 ${t.ring}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${t.badge}`}>{badge}</span>
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white ${t.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="text-gray-700 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ValueCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="mt-0.5 text-indigo-600">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-gray-600 text-sm mt-0.5">{children}</div>
      </div>
    </div>
  )
}
