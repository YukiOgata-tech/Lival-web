'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { MessageSquare, Send, X, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'
import Modal from '@/components/ui/Modal'

export default function FeatureSurvey() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [age, setAge] = useState<string>('')
  const [occupation, setOccupation] = useState('')
  const [isSubscriber, setIsSubscriber] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ text?: string; age?: string; occupation?: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) setErrors(null)
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newErrors: { text?: string; age?: string; occupation?: string } = {}
    const t = text.trim()
    if (!t) newErrors.text = 'ご要望を入力してください'
    else if (t.length > 1000) newErrors.text = '1000文字以内で入力してください'

    const a = age.trim()
    const ageNum = Number(a)
    if (!a) newErrors.age = '年齢を入力してください'
    else if (!/^[0-9]{1,3}$/.test(a) || Number.isNaN(ageNum)) newErrors.age = '半角数字で入力してください'
    else if (ageNum < 7 || ageNum > 120) newErrors.age = '7〜120の範囲で入力してください'

    const occ = occupation
    if (!occ) newErrors.occupation = '職業/役割を選択してください'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      const ref = collection(db, 'enterprise_feature_requests')
      await addDoc(ref, {
        uid: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        text: t,
        age: ageNum,
        occupation: occ,
        isSubscriber,
        page: 'enterprise',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setOpen(false)
      setText('')
      setAge('')
      setOccupation('')
      setIsSubscriber(false)
    } catch (err) {
      console.error('Failed to submit survey:', err)
      setErrors({ text: '送信に失敗しました。時間をおいて再度お試しください。' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">エンタープライズ版に欲しい機能を教えてください</h2>
              <p className="text-sm text-gray-600 mt-1">開発の参考にします。自由にご記入ください（ログインユーザーのみ回答可）。</p>
            </div>
            {!!user && (
              <button
                onClick={() => setOpen(true)}
                className="ml-auto inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                アンケートに回答する
              </button>
            )}
          </div>

          {!loading && !user && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 sm:p-5">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">まずは無料アカウントを作成して、アンケートにご協力ください</h3>
              <p className="text-xs sm:text-sm text-blue-900 mb-3">
                アカウント作成は無料です。マーケティング目的のメール配信は行いません（通知は送りません）。
              </p>
              <ul className="text-xs sm:text-sm text-blue-900 list-disc list-inside space-y-1 mb-3">
                <li>作成はすぐに完了します</li>
                <li>メール配信なし（安心してご回答いただけます）</li>
                <li>いつでも退会可能</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  無料でアカウント作成
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-4 py-2 text-blue-800 bg-white hover:bg-blue-50 transition-colors"
                >
                  ログイン
                </Link>
              </div>
            </div>
          )}

          {!!user && submitted && (
            <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
              送信ありがとうございました。いただいた内容は今後の開発に活用いたします。
            </div>
          )}
        </div>
      </div>

      {/* Modal with animation */}
      <Modal open={!!user && open} onClose={() => !submitting && setOpen(false)} ariaLabel="エンタープライズ版アンケート">
        <div className="rounded-2xl bg-white shadow-xl border border-gray-200 text-gray-900">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">アンケートに回答する</h3>
            <button
              onClick={() => !submitting && setOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="閉じる"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            {errors?.text && (
              <div className="flex items-center text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                <AlertCircle className="w-4 h-4 mr-2" /> {errors.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ご要望（1000文字まで）</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="例）面談用に生徒ごとの強み・つまずきの自動要約、課題の一括配信テンプレなど"
                className={`w-full min-h-[140px] rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${errors?.text ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                maxLength={1000}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">{text.length}/1000</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={7}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 ${errors?.age ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="例）16"
                />
                {errors?.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">職業 / 役割</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none focus:ring-2 text-gray-900 ${errors?.occupation ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                >
                  <option value="">選択してください</option>
                  <option value="中学教員">中学教員</option>
                  <option value="高校教員">高校教員</option>
                  <option value="大学教職員">大学教職員</option>
                  <option value="学校職員">学校職員</option>
                  <option value="塾講師">塾講師</option>
                  <option value="学習塾運営">学習塾運営</option>
                  <option value="保護者">保護者</option>
                  <option value="学生">学生</option>
                  <option value="社会人">社会人</option>
                  <option value="その他">その他</option>
                </select>
                {errors?.occupation && <p className="mt-1 text-xs text-red-600">{errors.occupation}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LIVAL AIのサブスクを利用していますか？</label>
              <button
                type="button"
                onClick={() => setIsSubscriber((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm text-gray-900"
              >
                {isSubscriber ? (
                  <ToggleRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-gray-500" />
                )}
                <span>{isSubscriber ? '利用しています' : '利用していません'}</span>
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => !submitting && setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                <Send className="w-4 h-4 mr-2" /> 送信する
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </section>
  )
}
