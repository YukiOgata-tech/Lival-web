"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SubscribeForm from '@/components/payments/SubscribeForm'
import { SUBSCRIPTION_PLANS } from '@/data/subscriptions'
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

function SubscribeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { userData, loading } = useAuth()
  const planId = searchParams.get('plan') as 'basic' | 'premium' | null

  // 既存サブスクリプションチェック
  const currentPlan = userData?.subscription?.plan
  const hasActiveSubscription = currentPlan && currentPlan !== 'free_web'

  if (!planId || (planId !== 'basic' && planId !== 'premium')) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          プランが選択されていません
        </h1>
        <p className="text-gray-600 mb-6">
          まずは料金プランを選択してください
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          料金プランを見る
        </Link>
      </div>
    )
  }

  // プレミアムプランの近日公開予定チェック
  const selectedPlan = SUBSCRIPTION_PLANS[planId]
  if (selectedPlan?.comingSoon) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔜</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              プレミアムプランは近日公開予定です
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              プレミアムプランは現在準備中です。<br />
              公開までもうしばらくお待ちください。
            </p>
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">プレミアムプランで提供予定の機能</h2>
              <ul className="text-left space-y-2 text-gray-700">
                {selectedPlan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                他のプランを見る
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                ダッシュボードへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 既存サブスクリプションがある場合の警告
  if (!loading && hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-yellow-900 mb-2">
                  既にサブスクリプションをご契約中です
                </h2>
                <p className="text-yellow-800 mb-4">
                  現在のプラン: <span className="font-semibold">{SUBSCRIPTION_PLANS[currentPlan]?.name}</span>
                </p>
                <p className="text-yellow-700 mb-6">
                  プラン変更をご希望の場合は、サブスクリプション管理ページから変更してください。
                  複数のサブスクリプションを作成することはできません。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/account/subscription"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  >
                    サブスクリプション管理ページへ
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                  >
                    ダッシュボードへ戻る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const plan = SUBSCRIPTION_PLANS[planId]
  const priceId = planId === 'basic'
    ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC
    : process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM

  // トライアル対象判定
  const isPremium = planId === 'premium'
  const hasUsedTrial = userData?.subscription?.hasUsedTrial || false
  const isTrialEligible = isPremium && !hasUsedTrial

  if (!priceId) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            設定エラー: Stripe Price IDが設定されていません。<br />
            管理者にお問い合わせください。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/pricing"
            className="inline-flex items-center text-base text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            プラン一覧に戻る
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            {plan.name}の申し込み
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">{plan.description}</p>
        </div>

        {/* トライアル案内 */}
        {isTrialEligible && (
          <div className="mb-6 p-4 sm:p-5 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <span className="text-3xl">🎁</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">3日間無料トライアル</h3>
                <p className="text-sm sm:text-base text-green-800 mb-3 leading-relaxed">
                  初めてプレミアムプランをご契約の方は、3日間無料でお試しいただけます。
                </p>
                <ul className="text-sm sm:text-base text-green-800 space-y-1.5">
                  <li>✓ トライアル期間中は料金が発生しません</li>
                  <li>✓ 3日以内にキャンセルすれば0円</li>
                  <li>✓ トライアル終了後、自動的に有料プランに移行します</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 決済フォーム */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8 mb-5 sm:mb-6">
          <SubscribeForm
            priceId={priceId}
            planName={plan.name}
            price={plan.price}
            isTrialEligible={isTrialEligible}
          />
        </div>

        {/* セキュリティ情報 */}
        <div className="flex items-start p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <Shield className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm sm:text-base text-blue-900">
            <p className="font-bold mb-1.5">安全な決済</p>
            <p className="text-blue-800 leading-relaxed">
              カード情報はStripeで暗号化されて処理されます。
              LIVAL AIのサーバーにカード情報は保存されません。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SubscribeContent />
    </Suspense>
  )
}

