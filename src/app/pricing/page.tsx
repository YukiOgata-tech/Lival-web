'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import VerifyEmailBanner from '@/components/account/VerifyEmailBanner'
import { SUBSCRIPTION_PLANS, formatPrice } from '@/data/subscriptions'
import { Check, Sparkles, Zap } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const { user, userData, loading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic')

  const handleSubscribe = (planId: 'basic' | 'premium') => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }

    // 既にサブスクリプションを持っている場合は、プラン変更ページへ
    if (currentPlan !== 'free_web') {
      router.push('/account/subscription')
      return
    }

    // フリープランの場合は新規サブスクリプション作成
    router.push(`/subscribe?plan=${planId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const currentPlan = userData?.subscription?.plan || 'free_web'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        {/* ヘッダー */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            あなたに最適なプランを選択
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            AI学習サポートで、最短の学習の近道
          </p>
        </div>
        {/* 未認証ユーザー向けバナー */}
        <div className="mb-4 sm:mb-6">
          <VerifyEmailBanner />
        </div>

        {/* 現在のプラン表示 */}
        {currentPlan !== 'free_web' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800 mb-2">
              現在のプラン: <span className="font-bold">{SUBSCRIPTION_PLANS[currentPlan]?.name}</span>
            </p>
            <p className="text-sm text-blue-700">
              プラン変更をご希望の場合は、プランカードをクリックしてサブスクリプション管理ページにアクセスしてください
            </p>
          </div>
        )}

        {/* プランカード */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {/* ベーシックプラン */}
          <PlanCard
            plan={SUBSCRIPTION_PLANS.basic}
            isCurrentPlan={currentPlan === 'basic'}
            onSelect={() => handleSubscribe('basic')}
            icon={<Zap className="w-6 h-6 text-blue-600" />}
          />

          {/* プレミアムプラン */}
          <PlanCard
            plan={SUBSCRIPTION_PLANS.premium}
            isCurrentPlan={currentPlan === 'premium'}
            onSelect={() => handleSubscribe('premium')}
            isPopular
            hasTrial={!userData?.subscription?.hasUsedTrial}
            icon={<Sparkles className="w-6 h-6 text-purple-600" />}
          />
        </div>

        {/* フリープランの説明 */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-6 bg-gray-100 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
            フリープランをご利用中の方へ
          </h3>
          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
            {SUBSCRIPTION_PLANS.free_web.description}
          </p>
          <ul className="space-y-1.5 sm:space-y-2">
            {SUBSCRIPTION_PLANS.free_web.features?.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            よくある質問
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="プレミアムプランはいつ利用できますか？"
              answer="プレミアムプランは現在準備中で、近日中に公開予定です。公開までもうしばらくお待ちください。初回リリース時には3無料トライアル期間を提供する予定です。"
            />
            <FAQItem
              question="支払い方法は何がありますか？"
              answer="クレジットカード・デビットカードでのお支払いが可能です。"
            />
            <FAQItem
              question="いつでもキャンセルできますか？"
              answer="はい、可能です。その後、キャンセル後も期間満了まではご利用いただけます。"
            />
            <FAQItem
              question="プラン変更は可能ですか？"
              answer="はい、アカウント設定からいつでもプラン変更が可能です。詳しい制約は実行前に確認できます。"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface PlanCardProps {
  plan: {
    name: string
    price: number
    currency: string
    description: string
    features?: string[]
    comingSoon?: boolean
  }
  isCurrentPlan: boolean
  isPopular?: boolean
  hasTrial?: boolean
  onSelect: () => void
  icon?: React.ReactNode
}

function PlanCard({ plan, isCurrentPlan, isPopular, hasTrial, onSelect, icon }: PlanCardProps) {
  const isComingSoon = plan.comingSoon || false

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform ${
        isComingSoon ? 'opacity-75' : 'hover:scale-105'
      } ${
        isPopular ? 'ring-2 ring-purple-500' : 'border border-gray-200'
      }`}
    >
      {/* 近日公開予定バッジ */}
      {isComingSoon && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg z-10">
          🔜 近日公開予定
        </div>
      )}

      {/* 人気バッジ */}
      {isPopular && !isComingSoon && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
          人気 No.1
        </div>
      )}

      {/* トライアルバッジ */}
      {hasTrial && !isComingSoon && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 text-sm font-semibold rounded-br-lg">
          🎁 3日間無料
        </div>
      )}

      <div className="p-5 sm:p-8">
        {/* アイコンとプラン名 */}
        <div className="flex items-center mb-3 sm:mb-4">
          {icon}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">{plan.name}</h3>
        </div>

        {/* 価格 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-5xl font-extrabold text-gray-900">
              {plan.price.toLocaleString()}
            </span>
            <span className="text-gray-600 ml-2 text-sm sm:text-base">/月</span>
          </div>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{plan.description}</p>
        </div>

        {/* 機能リスト */}
        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {plan.features?.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* 申し込みボタン */}
        <button
          onClick={isComingSoon ? undefined : onSelect}
          disabled={isCurrentPlan || isComingSoon}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
            isComingSoon
              ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 cursor-not-allowed border-2 border-orange-300'
              : isCurrentPlan
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isPopular
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isComingSoon ? '🔜 近日公開予定' : isCurrentPlan ? '現在のプラン' : 'このプランを選択'}
        </button>

        {/* 近日公開予定の説明 */}
        {isComingSoon && (
          <p className="text-sm text-center text-gray-600 mt-3">
            プレミアムプランは現在準備中です。<br />
            公開までもうしばらくお待ちください。
          </p>
        )}
      </div>
    </div>
  )
}

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="bg-white p-6 rounded-lg border border-gray-200">
      <summary className="font-semibold text-gray-900 cursor-pointer">
        {question}
      </summary>
      <p className="mt-3 text-gray-700">{answer}</p>
    </details>
  )
}





















