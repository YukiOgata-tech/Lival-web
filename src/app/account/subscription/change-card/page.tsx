'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, CheckCircle2, AlertCircle, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function CardUpdateForm({ onSuccess }: { onSuccess: () => void }) {
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
      const { error: confirmError } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: typeof window !== 'undefined'
            ? `${window.location.origin}/account/subscription`
            : undefined,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'カード情報の更新に失敗しました')
        setLoading(false)
        return
      }

      setMessage('カード情報を更新しました！')
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err: any) {
      console.error('Card update error:', err)
      setError(err?.message || '予期しないエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
      {/* Payment Element */}
      <div className="border border-gray-200 rounded-lg p-4">
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
      <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 space-y-2.5">
        <p className="font-bold text-blue-900 text-base">ℹ️ ご注意</p>
        <ul className="text-gray-700 space-y-1.5 leading-relaxed">
          <li>• 新しいカード情報は次回請求から適用されます</li>
          <li>• カード情報は安全に暗号化されて保存されます</li>
          <li>• サブスクリプションは継続されます</li>
        </ul>
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div className="flex items-start p-4 sm:p-5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-red-800 leading-relaxed">{error}</p>
        </div>
      )}

      {message && (
        <div className="flex items-start p-4 sm:p-5 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-green-800 leading-relaxed">{message}</p>
        </div>
      )}

      {/* 更新ボタン */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="flex-1 py-4 px-6 rounded-lg bg-blue-600 text-white text-base font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[52px]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 w-5 h-5" />
              更新中...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 w-5 h-5" />
              カード情報を更新
            </>
          )}
        </button>

        <Link
          href="/account/subscription"
          className="px-6 py-4 rounded-lg bg-gray-100 text-gray-700 text-base font-bold hover:bg-gray-200 transition-colors text-center flex items-center justify-center min-h-[52px]"
        >
          キャンセル
        </Link>
      </div>

      {/* セキュリティ表記 */}
      <p className="text-xs sm:text-sm text-center text-gray-600 leading-relaxed">
        🔒 カード情報はStripeで安全に処理されます
      </p>
    </form>
  )
}

export default function ChangeCardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [setupIntentSecret, setSetupIntentSecret] = useState<string | null>(null)
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

        const res = await fetch('/api/stripe/create-setup-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            userId: user.uid
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'SetupIntentの作成に失敗しました')
        }

        setSetupIntentSecret(data.clientSecret)
      } catch (e: any) {
        console.error('Setup intent initialization error:', e)
        setError(e?.message || '初期化に失敗しました')
      } finally {
        setInitializing(false)
      }
    }

    init()
  }, [user])

  const handleSuccess = () => {
    router.push('/account/subscription')
  }

  // 環境変数チェック
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Stripe設定エラー: 管理者にお問い合わせください
          </p>
        </div>
      </div>
    )
  }

  // ユーザー未ログイン
  if (!user && !initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 mb-4">ログインが必要です</p>
          <button
            onClick={() => router.push('/login?redirect=/account/subscription/change-card')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログインページへ
          </button>
        </div>
      </div>
    )
  }

  // エラー
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
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
      </div>
    )
  }

  // 初期化中
  if (initializing || !setupIntentSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
          <p className="text-gray-600">決済フォームを準備しています...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/account/subscription"
            className="text-base text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            サブスクリプション管理に戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">カード情報の変更</h1>
          <p className="text-base text-gray-600 mt-2">新しいカード情報を登録してください</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: setupIntentSecret,
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
            <CardUpdateForm onSuccess={handleSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
