"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

type Props = {
  priceId: string
  planName: string
  price: number
  isTrialEligible?: boolean
}

function InnerForm({ planName, price, isTrialEligible, onSuccess }: { planName: string; price: number; isTrialEligible?: boolean; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!stripe || !elements) {
      setError('決済システムの初期化中です。しばらくお待ちください。')
      return
    }

    setLoading(true)

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: typeof window !== 'undefined'
            ? `${window.location.origin}/payment-success`
            : undefined,
        },
      })

      if (confirmError) {
        // 3DSなどのリダイレクト後のエラー
        setError(confirmError.message || '決済処理中にエラーが発生しました')
        setLoading(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('決済が完了しました！サブスクリプションを有効化しています...')
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError('決済の確認ができませんでした。しばらくしてから再度お試しください。')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err?.message || '予期しないエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
        {/* プラン情報表示 */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-gray-900 block">{planName}</span>
            {isTrialEligible && (
              <div className="text-sm sm:text-base text-green-700 font-semibold mt-1.5">
                🎁 3日間無料トライアル適用
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            {isTrialEligible ? (
              <div>
                <div className="text-sm sm:text-base text-gray-500 line-through">
                  ¥{price.toLocaleString()}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  ¥0<span className="text-sm sm:text-base text-gray-600 font-normal">/3日間</span>
                </div>
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                ¥{price.toLocaleString()}<span className="text-sm sm:text-base text-gray-600 font-normal">/月</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-5">
        <PaymentElement
          options={{
            layout: 'tabs',
            terms: {
              card: 'never'
            }
          }}
        />
      </div>

      {/* 注意事項 */}
      <div className="text-sm sm:text-base text-gray-700 space-y-2 bg-gray-50 rounded-lg p-4">
        <p className="flex items-start">
          <span className="mr-2 flex-shrink-0">✓</span>
          <span>いつでもキャンセル可能です</span>
        </p>
        <p className="flex items-start">
          <span className="mr-2 flex-shrink-0">✓</span>
          <span>次回の請求日まで全機能をご利用いただけます</span>
        </p>
        <p className="flex items-start">
          <span className="mr-2 flex-shrink-0">✓</span>
          <span>カード情報は安全に暗号化されます</span>
        </p>
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div className="flex items-start p-4 sm:p-5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-red-800 leading-relaxed">{error}</p>
        </div>
      )}

      {message && (
        <div className="flex items-start p-4 sm:p-5 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-green-800 leading-relaxed">{message}</p>
        </div>
      )}

      {/* 申し込みボタン */}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full py-4 sm:py-5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base sm:text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px]"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 w-6 h-6" />
            処理中...
          </>
        ) : (
          `¥${price.toLocaleString()}/月で申し込む`
        )}
      </button>

      {/* セキュリティ表記 */}
      <p className="text-xs sm:text-sm text-center text-gray-600">
        🔒 決済情報はStripeで安全に処理されます
      </p>
    </form>

    {/* ローディングオーバーレイ */}
    {loading && <LoadingOverlay message="決済処理中です" />}
    </>
  )
}

export default function SubscribeForm({ priceId, planName, price, isTrialEligible }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Load publishable key from env
  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!pk) return null
    return loadStripe(pk)
  }, [])

  useEffect(() => {
    const init = async () => {
      if (!user) {
        setError('ログインが必要です')
        setInitializing(false)
        return
      }

      try {
        setError(null)

        // Firebase ID Tokenを取得
        const idToken = await user.getIdToken()

        const res = await fetch('/api/stripe/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            priceId,
            userId: user.uid
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'サブスクリプションの作成に失敗しました')
        }

        setClientSecret(data.clientSecret)
      } catch (e: any) {
        console.error('Subscription initialization error:', e)
        setError(e?.message || '初期化に失敗しました')
      } finally {
        setInitializing(false)
      }
    }

    init()
  }, [priceId, user])

  const handleSuccess = () => {
    router.push('/payment-success')
  }

  // 環境変数チェック
  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          Stripe設定エラー: 管理者にお問い合わせください
        </p>
      </div>
    )
  }

  // ユーザー未ログイン
  if (!user && !initializing) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-800 mb-4">決済を続けるにはログインが必要です</p>
        <button
          onClick={() => router.push('/login?redirect=/pricing')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ログインページへ
        </button>
      </div>
    )
  }

  // エラー
  if (error) {
    return (
      <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  // 初期化中
  if (initializing || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
        <p className="text-gray-600">決済フォームを準備しています...</p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            borderRadius: '8px'
          }
        },
        locale: 'ja'
      }}
    >
      <InnerForm planName={planName} price={price} isTrialEligible={isTrialEligible} onSuccess={handleSuccess} />
    </Elements>
  )
}

