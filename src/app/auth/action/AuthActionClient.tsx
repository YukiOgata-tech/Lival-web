'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'

export default function AuthActionClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'reset-form'>('idle')
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPw, setConfirmPw] = useState<string>('')
  const [oob, setOob] = useState<string>('')

  useEffect(() => {
    const mode = searchParams.get('mode')
    const oobCode = searchParams.get('oobCode')

    const run = async () => {
      if (!mode || !oobCode) {
        setStatus('error')
        setMessage('無効なリクエストです（必要なパラメータが不足しています）。')
        return
      }

      setOob(oobCode)
      setStatus('processing')
      try {
        if (mode === 'verifyEmail') {
          await applyActionCode(auth, oobCode)
          setStatus('success')
          setMessage('メール認証が完了しました。ありがとうございます。')
          setTimeout(() => router.push('/'), 2500)
        } else if (mode === 'resetPassword') {
          const mail = await verifyPasswordResetCode(auth, oobCode)
          setEmail(mail || '')
          setStatus('reset-form')
        } else {
          setStatus('error')
          setMessage('現在、このリンク種別は未対応です。トップへお戻りください。')
        }
      } catch (e) {
        setStatus('error')
        const msg = (e as { message?: string })?.message || '処理に失敗しました。リンクの有効期限切れの可能性があります。'
        setMessage(msg)
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-md w-full text-center">
      {status === 'reset-form' && (
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">パスワードの再設定</h1>
          {email && (
            <p className="text-sm text-gray-600 mb-6">対象メール: <span className="font-medium">{email}</span></p>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (newPassword.length < 8) {
                setMessage('パスワードは8文字以上で入力してください。')
                setStatus('error')
                return
              }
              if (newPassword !== confirmPw) {
                setMessage('パスワード（確認）が一致しません。')
                setStatus('error')
                return
              }
              setStatus('processing')
              try {
                await confirmPasswordReset(auth, oob, newPassword)
                setStatus('success')
                setMessage('パスワードを更新しました。ログイン画面からサインインしてください。')
              } catch (err) {
                setStatus('error')
                const msg = (err as { message?: string })?.message || 'パスワードの更新に失敗しました。'
                setMessage(msg)
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8文字以上"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              パスワードを更新する
            </button>
            <p className="text-xs text-gray-500">安全のため、更新後にログインページへ移動してください。</p>
          </form>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-700">処理しています…</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
          <h1 className="text-xl font-semibold text-gray-900">完了しました</h1>
          <p className="text-gray-700">{message}</p>
          <Link href="/" className="mt-2 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            トップへ戻る
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-red-600" />
          <h1 className="text-xl font-semibold text-gray-900">リンクの処理に失敗しました</h1>
          <p className="text-gray-700">{message}</p>
          <Link href="/" className="mt-2 inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            トップへ戻る
          </Link>
        </div>
      )}
    </div>
  )
}

