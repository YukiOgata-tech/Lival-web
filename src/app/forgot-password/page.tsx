'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)
    try {
      // メール言語（必要に応じて）
      auth.languageCode = 'ja'

      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const actionCodeSettings: Parameters<typeof sendPasswordResetEmail>[2] = {
        url: `${origin}/auth/action`,
        handleCodeInApp: true,
      }
      // Dynamic Links の独自ドメインがある場合に使用（任意）
      // @ts-expect-error runtime check for NEXT_PUBLIC_ var
      const dld = process.env.NEXT_PUBLIC_FIREBASE_DYNAMIC_LINK_DOMAIN as string | undefined
      if (dld) {
        // @ts-ignore
        actionCodeSettings.dynamicLinkDomain = dld
      }

      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      setSent(true)
    } catch (err) {
      const msg = (err as { message?: string })?.message || 'メール送信に失敗しました。時間をおいて再試行してください。'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              パスワード再設定
            </span>
          </Link>
          <p className="text-gray-600">登録メールアドレスに再設定リンクを送信します。</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-3 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-gray-800 font-medium mb-2">再設定メールを送信しました</p>
              <p className="text-gray-600 text-sm">受信トレイをご確認ください。届かない場合は迷惑メールをご確認のうえ、しばらくしてから再試行してください。</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">ログインへ</Link>
                <button onClick={() => setSent(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">別のメールで再送</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>再設定メールを送信</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-600">
                <span>アカウントをお持ちですか？</span>{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">ログイン</Link>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

