'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertTriangle, RefreshCcw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { sendEmailVerification, reload } from 'firebase/auth'

export default function VerifyEmailBanner() {
  const { user, loading } = useAuth()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloading, setReloading] = useState(false)

  if (loading || !user || user.emailVerified) return null

  const handleResend = async () => {
    if (!auth.currentUser) return
    try {
      setSending(true)
      setError(null)
      auth.languageCode = 'ja'
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      await sendEmailVerification(auth.currentUser, {
        url: `${origin}/auth/action`,
        handleCodeInApp: true
      })
      setSent(true)
    } catch (e) {
      setError((e as Error)?.message || '認証メールの再送に失敗しました')
    } finally {
      setSending(false)
    }
  }

  const handleRefreshVerified = async () => {
    if (!auth.currentUser) return
    try {
      setReloading(true)
      await reload(auth.currentUser)
    } finally {
      setReloading(false)
    }
  }

  return (
    <div className="mb-6 md:mb-8 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {sent ? (
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            ) : (
              <Mail className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">メール認証のお願い</h3>
            <p className="text-gray-700 text-sm sm:text-base mt-1">
              アカウント保護と機能の完全利用のため、登録メールアドレスの認証をお願いします。
              認証リンクには有効期限があります。期限切れの場合は再送してください。
            </p>
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleResend}
            disabled={sending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" /> {sending ? '送信中...' : sent ? '再送済み' : '認証メールを再送'}
          </button>
          <button
            onClick={handleRefreshVerified}
            disabled={reloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCcw className="w-4 h-4" /> {reloading ? '確認中...' : '認証を反映'}
          </button>
        </div>
      </div>
    </div>
  )
}

