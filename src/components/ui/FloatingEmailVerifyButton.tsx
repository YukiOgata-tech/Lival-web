'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MailCheck, MailWarning } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { sendEmailVerification, reload } from 'firebase/auth'

interface FloatingEmailVerifyButtonProps {
  className?: string
}

export default function FloatingEmailVerifyButton({ className = '' }: FloatingEmailVerifyButtonProps) {
  const { user, loading } = useAuth()
  const [visible, setVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      setVisible(!user.emailVerified)
    } else {
      setVisible(false)
    }
  }, [user, loading])

  const handleSendVerification = async () => {
    if (!auth.currentUser) return
    try {
      setSending(true)
      setError(null)
      // メール文面と言語の日本語化
      auth.languageCode = 'ja'
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      await sendEmailVerification(auth.currentUser, {
        url: `${origin}/auth/action`,
        handleCodeInApp: true
        // dynamicLinkDomain: process.env.NEXT_PUBLIC_FIREBASE_DYNAMIC_LINK_DOMAIN // 必要に応じて使用
      })
      setSent(true)
    } catch (e) {
      const message = (e as Error)?.message || 'メールの送信に失敗しました'
      setError(message)
    } finally {
      setSending(false)
    }
  }

  const handleCheckVerified = async () => {
    if (!auth.currentUser) return
    try {
      await reload(auth.currentUser)
      if (auth.currentUser.emailVerified) {
        setVisible(false)
      }
    } catch {
      // 失敗時は無視（しばらくしてから再試行）
    }
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        {/* 背景エフェクト */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full animate-pulse opacity-30"></div>

        {/* メインボタン */}
        <motion.button
          onClick={handleSendVerification}
          disabled={sending}
          className="relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center bg-gradient-to-r from-amber-600 to-pink-600 disabled:opacity-70"
        >
          {sent ? (
            <MailCheck className="w-7 h-7 text-white" />
          ) : (
            <MailWarning className="w-7 h-7 text-white" />
          )}
        </motion.button>

        {/* ツールチップ */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-gray-700"
          >
            {sent ? '確認メールを送信しました' : 'メール認証のお願い'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* サブアクション（確認済みにする） */}
        <div className="absolute -top-2 -right-2">
          <button
            onClick={handleCheckVerified}
            className="w-6 h-6 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow"
            title="認証を再チェック"
          >
            ✓
          </button>
        </div>

        {/* エラーメッセージ（簡易） */}
        {error && (
          <div className="absolute -bottom-10 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
            {error}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
