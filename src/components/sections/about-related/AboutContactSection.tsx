'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, MessageCircle, Users, Building } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { logger } from '@/lib/utils/logger'

const contactMethods = [
  {
    icon: Mail,
    title: 'お問い合わせ（統一窓口）',
    description: '一般・法人・メディアのすべてのご連絡はこちら',
    contact: 'info@lival-ai.com',
    color: 'from-blue-500 to-indigo-600'
  }
]

const socialLinks = [
  { name: 'Twitter', handle: '@lival_ai', url: '#', color: 'hover:text-blue-400' }
]

export default function AboutContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('サービスについて')
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('') // ハニーポット（見えない）
  const [hv, setHv] = useState('') // JS 検証トークン
  const [consent, setConsent] = useState(false) // 確認チェック
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null) // 送信後クールダウン
  const firstInteracted = useRef(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setStartedAt(null)
    setHv('1') // 初期描画後に即座にセット（JS動作確認用）
  }, [])

  const now = Date.now()
  const isCoolingDown = cooldownUntil ? now < cooldownUntil : false
  const disabled = useMemo(
    () => submitting || isCoolingDown || !name || !email || !message || !consent,
    [submitting, isCoolingDown, name, email, message, consent]
  )

  function onFirstInteract() {
    if (!firstInteracted.current) {
      firstInteracted.current = true
      setStartedAt(Date.now())
    }
  }

  function linkCount(text: string): number {
    const re = /(https?:\/\/|www\.)/gi
    return (text.match(re) || []).length
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (disabled || submitting) return
    setSubmitting(true)
    setResult(null)
    // UI側の簡易スパム判定
    if (!startedAt || Date.now() - startedAt < 3000) {
      setResult({ type: 'error', message: '送信が早すぎます。数秒待ってからお試しください。' })
      setSubmitting(false)
      return
    }
    if (message.trim().length < 15) {
      setResult({ type: 'error', message: 'メッセージは15文字以上でご記入ください。' })
      setSubmitting(false)
      return
    }
    if (linkCount(message) > 2) {
      setResult({ type: 'error', message: 'URLの記載が多すぎます。リンクは2件以内にしてください。' })
      setSubmitting(false)
      return
    }

    const payload = {
      name,
      email,
      subject,
      message,
      _hp: hp, // honeypot: 空であること
      hv, // JS トークン: '1' が必須
      startedAt: startedAt ?? Date.now(),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        logger.error('contact_submit_failed', { status: res.status, data })
        const msg =
          data?.error === 'too_fast'
            ? '送信が早すぎます。数秒待ってからお試しください。'
            : data?.error === 'blocked'
            ? '送信がブロックされました。しばらくしてからお試しください。'
            : data?.error === 'missing_api_key'
            ? 'サーバー設定エラー（APIキー未設定）。管理者にお問い合わせください。'
            : data?.error === 'send_failed' && data?.hint === 'verify_from_domain_or_set_RESEND_FROM_onboarding'
            ? '送信元ドメイン未認証の可能性があります。管理者は RESEND_FROM に onboarding@resend.dev を設定してテストしてください。'
            : '送信に失敗しました。時間をおいて再度お試しください。'
        setResult({ type: 'error', message: msg })
      } else {
        setResult({ type: 'success', message: '送信しました。担当者よりご連絡いたします。' })
        setName('')
        setEmail('')
        setSubject('サービスについて')
        setMessage('')
        setHp('')
        setStartedAt(null)
        setConsent(false)
        setCooldownUntil(Date.now() + 30_000) // 30秒のクールダウン
      }
    } catch (err) {
      logger.error('contact_submit_exception', { err: String(err) })
      setResult({ type: 'error', message: '送信中にエラーが発生しました。時間をおいて再度お試しください。' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            お気軽にご連絡ください
          </h2>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            ご質問、ご提案、協業のご相談など、どんなことでもお気軽にお声がけください。
            若いチームならではのフットワークで、迅速に対応いたします。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Contact Methods */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">{method.description}</p>
                    
                    <a 
                      href={`mailto:${method.contact}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      {method.contact}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">簡単お問い合わせ</h3>
              
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">お名前</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="山田太郎"
                      name="name"
                      value={name}
                      onChange={(e) => { onFirstInteract(); setName(e.target.value) }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">メールアドレス</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="yamada@example.com"
                      name="email"
                      value={email}
                      onChange={(e) => { onFirstInteract(); setEmail(e.target.value) }}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">件名</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    name="subject"
                    value={subject}
                    onChange={(e) => { onFirstInteract(); setSubject(e.target.value) }}
                    required
                  >
                    <option>サービスについて</option>
                    <option>導入検討</option>
                    <option>メディア取材</option>
                    <option>その他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">メッセージ</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="お気軽にご質問・ご相談ください..."
                    name="message"
                    value={message}
                    onChange={(e) => { onFirstInteract(); setMessage(e.target.value) }}
                    required
                  ></textarea>
                </div>

                {/* 送信前確認（UI フリクション） */}
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  私はロボットではありません。内容に住所や電話番号などの個人情報が入っていないことを確認しました。
                </label>

                {/* ハニーポット（視覚的に見えないフィールド） */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
                  <label>
                    会社名（このフィールドは空のままにしてください）
                    <input
                      type="text"
                      name="_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore
                      data-form-type="other"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                    />
                  </label>
                </div>
                {/* 最小送信時間のための開始タイムスタンプ */}
                <input type="hidden" name="startedAt" value={startedAt ?? ''} />
                {/* JS 検証トークン */}
                <input type="hidden" name="hv" value={hv} />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-60"
                  type="submit"
                  disabled={disabled}
                >
                  {submitting ? '送信中…' : isCoolingDown ? 'しばらくお待ちください' : '送信する'}
                </motion.button>

                {result && (
                  <p
                    className={
                      result.type === 'success'
                        ? 'text-green-400 text-sm'
                        : 'text-red-400 text-sm'
                    }
                    role="status"
                    aria-live="polite"
                  >
                    {result.message}
                  </p>
                )}
              </form>
            </motion.div>
          </div>

          {/* Social & Response Info */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">SNS・コミュニティ</h3>
              
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`block p-3 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group ${social.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{social.name}</div>
                        <div className="text-gray-400 text-sm">{social.handle}</div>
                      </div>
                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-4 sm:p-6 border border-blue-500/20"
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">レスポンス目標</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">一般お問い合わせ</span>
                  <span className="text-blue-400 font-semibold">24時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">法人・導入相談</span>
                  <span className="text-blue-400 font-semibold">12時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">メディア取材</span>
                  <span className="text-blue-400 font-semibold">48時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">緊急事項</span>
                  <span className="text-blue-400 font-semibold">即座</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 p-4 sm:p-8 bg-gradient-to-r from-gray-800/30 to-slate-800/30 rounded-2xl border border-gray-700/30"
        >
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            LIVAL AIは、大学生を中心とした若いチームが運営しています。<br />
            フレッシュな視点と情熱で、皆様のご期待にお応えできるよう努めております。<br />
            どんな小さなことでも、お気軽にお声がけください。
          </p>
        </motion.div>
      </div>
    </section>
  )
}
