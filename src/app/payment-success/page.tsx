'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const { userData, refreshUserData, loading } = useAuth()

  useEffect(() => {
    // ユーザーデータをリフレッシュ（サブスク状態を最新化）
    refreshUserData()
  }, [refreshUserData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* 成功カード */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* アイコン */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* メッセージ */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            お支払いが完了しました！
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            LIVAL AIのプレミアム機能をお楽しみください
          </p>

          {/* プラン情報 */}
          {!loading && userData?.subscription && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.subscription.plan === 'basic' ? 'ベーシックプラン' : 'プレミアムプラン'}
                </h2>
              </div>
              <p className="text-gray-700">
                次回請求日: {userData.subscription.currentPeriodEnd
                  ? new Date(userData.subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString('ja-JP')
                  : '取得中...'}
              </p>
            </div>
          )}

          {/* 次のステップ */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">次にできること:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">✨ AI学習を開始</div>
                <p className="text-sm text-gray-600">AIチューターと一緒に効率的な学習を</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">📊 学習記録を管理</div>
                <p className="text-sm text-gray-600">進捗を可視化して目標達成</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">🎯 診断を受ける</div>
                <p className="text-sm text-gray-600">あなたの学習タイプを分析</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">⚙️ 設定をカスタマイズ</div>
                <p className="text-sm text-gray-600">プロフィールと学習環境を整える</p>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              ダッシュボードへ
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              href="/account/subscription"
              className="inline-block w-full px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              サブスクリプション設定を確認
            </Link>
          </div>
        </div>

        {/* サポート情報 */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ご不明な点がございましたら、
            <Link href="/contact" className="text-blue-600 hover:underline mx-1">
              お問い合わせ
            </Link>
            ください
          </p>
        </div>
      </div>
    </div>
  )
}
