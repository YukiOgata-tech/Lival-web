'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { SUBSCRIPTION_PLANS, formatPrice } from '@/data/subscriptions'
import {
  getSubscriptionDisplayInfo,
  getSubscriptionStatus,
  hasActiveStripeSubscription,
  isOverrideAccess
} from '@/lib/subscription/access-control'
import {
  CreditCard,
  Calendar,
  Check,
  X,
  AlertCircle,
  Crown,
  Shield,
  ArrowUpCircle,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

type PaymentMethod = {
  brand: string
  last4: string
  expMonth: number
  expYear: number
}

type Invoice = {
  id: string
  amount: number
  amountDue: number
  currency: string
  status: string
  created: number
  pdfUrl: string | null
  hostedUrl: string | null
  periodStart: number
  periodEnd: number
}

export default function SubscriptionPage() {
  const { user, userData, loading } = useAuth()
  const [canceling, setCanceling] = useState(false)
  const [resuming, setResuming] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('')

  // カード情報と請求履歴を取得
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!user || !userData?.subscription?.stripeCustomerId) {
        setLoadingDetails(false)
        return
      }

      try {
        const idToken = await user.getIdToken()
        const res = await fetch('/api/stripe/subscription-details', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })

        if (res.ok) {
          const data = await res.json()
          setPaymentMethod(data.paymentMethod)
          setInvoices(data.invoices)
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error)
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchSubscriptionDetails()
  }, [user, userData])

  const handleChangePlan = async (newPlan: 'basic' | 'premium') => {
    const newPriceId = newPlan === 'basic'
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM

    if (!newPriceId) {
      alert('設定エラー: Price IDが見つかりません')
      return
    }

    const currentPlan = userData?.subscription.plan
    const isUpgrade = (currentPlan === 'basic' && newPlan === 'premium')
    const isDowngrade = (currentPlan === 'premium' && newPlan === 'basic')

    const newPlanInfo = SUBSCRIPTION_PLANS[newPlan]
    const currentPlanInfo = SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS]

    let message = ''

    if (isUpgrade) {
      message = `プレミアムプランにアップグレードしますか？

【変更内容】
• 現在のプラン: ${currentPlanInfo.name} (${formatPrice(currentPlanInfo.price)}/月)
• 新しいプラン: ${newPlanInfo.name} (${formatPrice(newPlanInfo.price)}/月)

【請求について】
✅ 変更は即座に適用されます
✅ 今月の未使用分の差額が今すぐ請求されます
✅ すぐにプレミアム機能が利用可能になります
✅ 次回以降は ${formatPrice(newPlanInfo.price)}/月 の請求になります

よろしいですか？`
    } else if (isDowngrade) {
      const periodEndDate = userData?.subscription?.currentPeriodEnd
      const periodEndDateStr = periodEndDate
        ? new Date(periodEndDate.seconds * 1000).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : '次回請求日'

      message = `ベーシックプランにダウングレードしますか？

【変更内容】
• 現在のプラン: ${currentPlanInfo.name} (${formatPrice(currentPlanInfo.price)}/月)
• 新しいプラン: ${newPlanInfo.name} (${formatPrice(newPlanInfo.price)}/月)

【請求について】
✅ ${periodEndDateStr} までは現在のプレミアムプランのまま利用できます
✅ 即座の追加請求はありません（払った分は使えます）
✅ ${periodEndDateStr} 以降、自動的にベーシックプランに変更されます
✅ 次回請求額: ${formatPrice(newPlanInfo.price)}/月

よろしいですか？`
    } else {
      message = `プランを変更しますか？\n変更は即座に適用され、差額が日割り計算されます。`
    }

    if (!confirm(message)) {
      return
    }

    setChangingPlan(true)
    setLoadingMessage('プランを変更しています')
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/stripe/change-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPriceId })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'プラン変更に失敗しました')
      }

      // 変更タイプに応じたメッセージを表示
      if (data.changeType === 'upgrade') {
        alert('✅ プレミアムプランにアップグレードしました！\n\n差額が決済され、プレミアム機能が即座に利用可能になりました。')
      } else if (data.changeType === 'downgrade') {
        const periodEndDate = userData?.subscription?.currentPeriodEnd
        const periodEndDateStr = periodEndDate
          ? new Date(periodEndDate.seconds * 1000).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : '次回請求日'
        alert(`✅ ダウングレードを予約しました！\n\n${periodEndDateStr} までは現在のプレミアムプランのまま利用できます。\n${periodEndDateStr} 以降、自動的にベーシックプランに変更されます。`)
      } else {
        alert('✅ プランを変更しました！')
      }

      window.location.reload()
    } catch (error: any) {
      console.error('Change plan error:', error)
      alert(`❌ プラン変更中にエラーが発生しました\n\n${error.message || '不明なエラー'}\n\nカード情報が有効か確認し、もう一度お試しください。`)
    } finally {
      setChangingPlan(false)
      setLoadingMessage('')
    }
  }

  const handleResumeSubscription = async () => {
    const currentPlanInfo = SUBSCRIPTION_PLANS[userData?.subscription.plan as keyof typeof SUBSCRIPTION_PLANS]

    const message = `サブスクリプションを再開しますか？

【再開後の内容】
• プラン: ${currentPlanInfo.name}
• 次回請求: 予定通り継続されます
• 自動更新: 有効になります

キャンセル予定が解除され、サブスクリプションが継続されます。

再開しますか？`

    if (!confirm(message)) {
      return
    }

    setResuming(true)
    setLoadingMessage('サブスクリプションを再開しています')
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/stripe/resume-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error('再開に失敗しました')

      alert(`✅ サブスクリプションを再開しました\n\n引き続きご利用いただけます。次回請求日まで自動的に更新されます。`)
      window.location.reload()
    } catch (error: any) {
      console.error('Resume error:', error)
      alert(`❌ 再開処理中にエラーが発生しました\n\n${error.message || '不明なエラー'}\n\nお手数ですが、もう一度お試しください。`)
    } finally {
      setResuming(false)
      setLoadingMessage('')
    }
  }

  const handleCancelSubscription = async () => {
    const currentPlanInfo = SUBSCRIPTION_PLANS[userData?.subscription.plan as keyof typeof SUBSCRIPTION_PLANS]
    const periodEnd = userData?.subscription.currentPeriodEnd
      ? userData.subscription.currentPeriodEnd.toDate().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '不明'

    const message = `サブスクリプションをキャンセルしますか？

【キャンセル後の流れ】
• 現在のプラン: ${currentPlanInfo.name}
• サービス利用: ${periodEnd}まで引き続き全機能をご利用いただけます
• 次回請求: ${periodEnd}以降は請求されません
• 自動ダウングレード: 期間終了後はフリープランに移行します

【ご注意】
• 即座に機能が失われることはありません
• 支払い済みの期間は最後まで使い切れます
• 期間内であればいつでも再開できます

本当にキャンセルしますか？`

    if (!confirm(message)) {
      return
    }

    setCanceling(true)
    setLoadingMessage('サブスクリプションをキャンセルしています')
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error('キャンセルに失敗しました')

      alert(`✅ サブスクリプションをキャンセルしました\n\n${periodEnd} までは引き続き全機能をご利用いただけます。\nまたのご利用をお待ちしております。`)
      window.location.reload()
    } catch (error: any) {
      console.error('Cancel error:', error)
      alert(`❌ キャンセル処理中にエラーが発生しました\n\n${error.message || '不明なエラー'}\n\nお手数ですが、もう一度お試しください。`)
    } finally {
      setCanceling(false)
      setLoadingMessage('')
    }
  }

  const formatCardBrand = (brand: string) => {
    const brands: Record<string, string> = {
      'visa': 'Visa',
      'mastercard': 'Mastercard',
      'amex': 'American Express',
      'jcb': 'JCB',
      'diners': 'Diners Club',
      'discover': 'Discover'
    }
    return brands[brand.toLowerCase()] || brand
  }

  const formatInvoiceStatus = (status: string) => {
    const statuses: Record<string, { label: string; className: string }> = {
      'paid': { label: '支払い済み', className: 'bg-green-100 text-green-800' },
      'open': { label: '未払い', className: 'bg-yellow-100 text-yellow-800' },
      'draft': { label: '下書き', className: 'bg-gray-100 text-gray-800' },
      'void': { label: '無効', className: 'bg-red-100 text-red-800' },
      'uncollectible': { label: '回収不能', className: 'bg-red-100 text-red-800' }
    }
    return statuses[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  const displayInfo = getSubscriptionDisplayInfo(userData)
  const statusInfo = getSubscriptionStatus(userData)
  const hasStripeSubscription = hasActiveStripeSubscription(userData)
  const isSpecialAccess = isOverrideAccess(userData)

  const currentPlan = SUBSCRIPTION_PLANS[userData.subscription.plan]

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3 sm:mb-5">
          <Link
            href="/account"
            className="text-sm sm:text-base text-blue-600 hover:text-blue-700 mb-2 inline-flex items-center font-medium"
          >
            ← アカウント設定に戻る
          </Link>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">サブスクリプション管理</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">プランの詳細と請求情報</p>
        </div>

        {/* キャンセル予定の警告 */}
        {userData.subscription.cancelAt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start flex-1">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-bold text-yellow-900 mb-1">⚠️ サブスクリプションキャンセル予定</p>
                  <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                    {userData.subscription.cancelAt.toDate().toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} にサブスクリプションが自動終了します。それまでは引き続き全機能をご利用いただけます。
                  </p>
                </div>
              </div>
              <button
                onClick={handleResumeSubscription}
                disabled={resuming}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {resuming ? '再開中...' : '再開する'}
              </button>
            </div>
          </motion.div>
        )}

        {/* 特別アクセス通知 */}
        {isSpecialAccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start"
          >
            <Shield className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-amber-900 mb-1">特別アクセス権限</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                {displayInfo.overrideReason === 'admin'
                  ? '管理者権限により、全機能にアクセスできます'
                  : `${displayInfo.overrideReason}により、プレミアム機能にアクセスできます`}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* 現在のプラン */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">現在のプラン</h2>
                {userData.subscription.plan !== 'free_web' && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {userData.subscription.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                )}
              </div>

              <div className="flex items-start space-x-4 sm:space-x-5 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{displayInfo.planName}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1.5 leading-relaxed">{currentPlan.description}</p>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {formatPrice(currentPlan.price)}
                    </span>
                    {currentPlan.interval && (
                      <span className="text-base sm:text-lg text-gray-600 ml-2">/ {currentPlan.interval === 'month' ? '月' : '年'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* プラン機能一覧 */}
              <div className="space-y-3 mb-6">
                {currentPlan.features?.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* アップグレードボタン（フリープランのみ） */}
              {userData.subscription.plan === 'free_web' && (
                <Link
                  href="/pricing"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg text-base font-bold hover:shadow-lg transition-all min-h-[52px]"
                >
                  <ArrowUpCircle className="w-6 h-6" />
                  <span>有料プランにアップグレード</span>
                </Link>
              )}
            </motion.div>

            {/* 請求情報（Stripeサブスクがある場合のみ） */}
            {hasStripeSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">請求情報</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-start sm:items-center gap-3">
                    <span className="text-sm sm:text-base text-gray-600">次回請求日</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex items-center text-right">
                      <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {userData.subscription.currentPeriodEnd
                        ? userData.subscription.currentPeriodEnd.toDate().toLocaleDateString('ja-JP')
                        : '未設定'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <span className="text-sm sm:text-base text-gray-600">次回請求額</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      {formatPrice(currentPlan.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-start sm:items-center gap-3">
                    <span className="text-sm sm:text-base text-gray-600">お支払い方法</span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex items-center text-right">
                      <CreditCard className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {loadingDetails ? (
                        '読み込み中...'
                      ) : paymentMethod ? (
                        `${formatCardBrand(paymentMethod.brand)} •••• ${paymentMethod.last4}`
                      ) : (
                        'カード情報なし'
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Link
                    href="/account/subscription/change-card"
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3.5 px-6 rounded-lg text-base font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
                  >
                    <Settings className="w-5 h-5" />
                    <span>カード情報を変更</span>
                  </Link>

                  {userData.subscription.cancelAt ? (
                    <button
                      onClick={handleResumeSubscription}
                      disabled={resuming}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3.5 px-6 rounded-lg text-base font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 min-h-[48px]"
                    >
                      <Check className="w-5 h-5" />
                      <span>{resuming ? '再開中...' : 'サブスクリプションを再開'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                      className="w-full flex items-center justify-center space-x-2 text-red-600 py-3.5 px-6 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[48px]"
                    >
                      <X className="w-5 h-5" />
                      <span>{canceling ? 'キャンセル中...' : 'サブスクリプションをキャンセル'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* 請求履歴 */}
            {hasStripeSubscription && invoices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">請求履歴</h2>

                <div className="space-y-3">
                  {invoices.map((invoice) => {
                    const statusInfo = formatInvoiceStatus(invoice.status)
                    // 日本円の場合は100で割らない（Stripeは円を最小単位で保存）
                    // draft請求書の場合はamountDueを使用
                    const displayAmount = invoice.status === 'draft' || invoice.status === 'open'
                      ? (invoice.currency === 'jpy' ? invoice.amountDue : invoice.amountDue / 100)
                      : (invoice.currency === 'jpy' ? invoice.amount : invoice.amount / 100)

                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1.5">
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                              ¥{displayAmount.toLocaleString('ja-JP')}
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.created * 1000).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {invoice.status === 'draft' && (
                            <p className="text-xs text-gray-500 mt-1">
                              ※ 次回請求時に確定されます
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {invoice.pdfUrl && (
                            <a
                              href={invoice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="PDFをダウンロード"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                          )}
                          {invoice.hostedUrl && (
                            <a
                              href={invoice.hostedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="詳細を表示"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* プラン変更 */}
            {!isSpecialAccess && userData.subscription.plan !== 'free_web' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">プラン変更</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
                  他のプランに変更できます。変更は即座に適用され、差額が日割り計算されます。
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ベーシックプラン */}
                  {userData.subscription.plan !== 'basic' && (
                    <div className="border-2 border-gray-200 rounded-xl p-5">
                      <h3 className="text-base font-bold text-gray-900 mb-3">ベーシックプラン</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                        {formatPrice(SUBSCRIPTION_PLANS.basic.price)}
                        <span className="text-base font-normal text-gray-600 ml-1">/月</span>
                      </p>
                      <button
                        onClick={() => handleChangePlan('basic')}
                        disabled={changingPlan}
                        className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[48px]"
                      >
                        {changingPlan ? '変更中...' : userData.subscription.plan === 'premium' ? 'ダウングレード' : 'このプランに変更'}
                      </button>
                    </div>
                  )}

                  {/* プレミアムプラン */}
                  {userData.subscription.plan !== 'premium' && (
                    <div className="border-2 border-orange-300 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-amber-50 relative opacity-75">
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        🔜 近日公開
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900">プレミアムプラン</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                        {formatPrice(SUBSCRIPTION_PLANS.premium.price)}
                        <span className="text-base font-normal text-gray-600 ml-1">/月</span>
                      </p>
                      <button
                        disabled
                        className="w-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 py-3.5 px-4 rounded-lg text-base font-bold cursor-not-allowed border-2 border-orange-300 min-h-[48px]"
                      >
                        近日公開予定
                      </button>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        準備中です。もうしばらくお待ちください。
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-3 sm:space-y-4">
            {/* ステータス情報 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ステータス</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className={`w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0 ${
                      statusInfo.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900">
                      {statusInfo.isActive ? 'アクティブ' : '非アクティブ'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{statusInfo.message}</p>
                  </div>
                </div>

                {statusInfo.isExpiringSoon && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-yellow-900">まもなく期限切れ</p>
                        <p className="text-sm text-yellow-800 mt-1">
                          あと{statusInfo.daysRemaining}日で期限が切れます
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ヘルプ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-xl border border-blue-200 p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">サポート</h3>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                サブスクリプションに関するご質問やお困りのことがあれば、お気軽にお問い合わせください。
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                お問い合わせ →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ローディングオーバーレイ */}
      {(canceling || resuming || changingPlan) && <LoadingOverlay message={loadingMessage} />}
    </div>
  )
}
