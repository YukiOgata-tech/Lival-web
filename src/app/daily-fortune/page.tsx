'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Share2, Twitter } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { generateDailyFortune, getTodayDate, formatDateJapanese } from '@/lib/dailyFortuneLogic'
import { FortuneResult } from '@/types/dailyFortune'

// character 1 webmファイルのリスト
const LOADING_VIDEOS = [
  'li-kun-AC-1.webm',
  'li-kun-CH-1.webm',
  'li-kun-EX-1.webm',
  'li-kun-OP-1.webm',
  'val-chan-SP-1.webm',
  'val-chan-ST-1.webm',
]

export default function DailyFortunePage() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [userName, setUserName] = useState('')
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')

  // ログインユーザーのデータを取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()

            // 生年月日を取得して YYYY-MM-DD 形式に変換
            if (userData.birthday) {
              const birthdayDate = userData.birthday.toDate()
              const year = birthdayDate.getFullYear()
              const month = String(birthdayDate.getMonth() + 1).padStart(2, '0')
              const day = String(birthdayDate.getDate()).padStart(2, '0')
              setBirthDate(`${year}-${month}-${day}`)
            }

            // 性別を設定
            if (userData.gender) {
              setGender(userData.gender)
            }

            // 表示名を設定
            if (userData.displayName) {
              setUserName(userData.displayName)
            }
          }
        } catch (error) {
          console.error('ユーザーデータの取得に失敗しました:', error)
        }
      } else {
        setIsLoggedIn(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // ローディング処理
  useEffect(() => {
    if (step === 'loading') {
      // ランダムに動画を選択
      const randomVideo = LOADING_VIDEOS[Math.floor(Math.random() * LOADING_VIDEOS.length)]
      setSelectedVideo(randomVideo)

      const startTime = Date.now()
      const minLoadingTime = 3000 // 最短3秒

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / minLoadingTime) * 100, 100)
        setLoadingProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          setStep('result')
        }
      }, 50)

      return () => clearInterval(interval)
    }
  }, [step])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthDate || !gender) {
      alert('生年月日と性別を入力してください')
      return
    }

    // 占い結果を生成
    const result = generateDailyFortune({
      birthDate,
      gender,
      date: getTodayDate()
    })

    setFortuneResult(result)
    setStep('loading')
  }

  const handleReset = () => {
    setStep('input')
    setLoadingProgress(0)
  }

  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return 'from-yellow-400 via-orange-400 to-red-400'
    if (score >= 4.0) return 'from-green-400 to-emerald-500'
    if (score >= 3.5) return 'from-blue-400 to-cyan-400'
    if (score >= 3.0) return 'from-gray-400 to-gray-500'
    if (score >= 2.0) return 'from-indigo-400 to-purple-400'
    return 'from-slate-500 to-gray-600'
  }

  const getStarCount = (score: number): number => {
    return Math.round(score)
  }

  // SNS共有機能
  const handleShare = (platform: 'twitter' | 'line' | 'copy') => {
    if (!fortuneResult) return

    const name = userName || 'あなた'
    const text = `今日も勉強頑張ろう。学習占いで運勢チェック！${name}さんの運勢は「${fortuneResult.luckLabel}」でした✨ #LIVAL学習占い`
    const url = typeof window !== 'undefined' ? window.location.href : ''

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        )
        break
      case 'line':
        window.open(
          `https://line.me/R/msg/text/?${encodeURIComponent(text + ' ' + url)}`,
          '_blank'
        )
        break
      case 'copy':
        navigator.clipboard.writeText(text + '\n' + url)
        alert('クリップボードにコピーしました！')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-12">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mr-3" />
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400" style={{ fontFamily: 'var(--font-yusei-magic)' }}>
              学習デイリー占い
            </h1>
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 ml-3" />
          </div>
          <p className="text-purple-200 text-sm md:text-lg" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
            今日の学習運を占って、最高の一日にしよう！
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* 入力フォーム */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-purple-500/30">
                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                      お名前（任意）
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="例: 太郎"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                      生年月日 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                      性別 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold mt-2 py-2 sm:py-4 px-6 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    style={{ fontFamily: 'var(--font-mochiy-pop)' }}
                  >
                    今日の運勢を占う ✨
                  </motion.button>
                </form>

                <div className="mt-4 space-y-2">
                  <p className="text-center text-purple-300 text-xs" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                    ※ 同じ日は何度占っても同じ結果が出ます
                  </p>
                  {!isLoggedIn && (
                    <p className="text-center text-yellow-300/80 text-xs" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                      💡 ログインで即座に占いが可能です
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ローディング画面 */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center px-4"
            >
              <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-10 md:p-16 shadow-2xl border border-purple-500/30">
                <div className="mb-8 relative">
                  {selectedVideo && (
                    <video
                      autoPlay loop muted playsInline disablePictureInPicture
                      className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-lg"
                      style={{
                        background: 'transparent',
                        filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))',
                        objectFit: 'contain'
                      }}
                    >
                      <source src={`/webm/${selectedVideo}`} type="video/webm" />
                    </video>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-6" style={{ fontFamily: 'var(--font-yusei-magic)' }}>
                  運勢を占っています...
                </h2>

                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <p className="text-purple-300 text-base md:text-lg" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  星の力であなたの運勢を読み解いています...
                </p>
              </div>
            </motion.div>
          )}

          {/* 結果表示画面 */}
          {step === 'result' && fortuneResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-3 md:space-y-6"
            >
              {/* 日付表示 */}
              <div className="text-center">
                <p className="text-purple-300 text-base md:text-lg" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  {formatDateJapanese(fortuneResult.fortuneDate)}の運勢
                </p>
              </div>

              {/* 総合運勢 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl p-4 md:p-8 shadow-2xl border-2 border-yellow-400/50"
              >
                <div className="text-center mb-3 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-purple-200 mb-2 md:mb-4" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                    {userName ? `${userName}さん` : 'あなた'}の総合学習運
                  </h2>

                  <div className={`text-4xl md:text-7xl font-bold bg-gradient-to-r ${getScoreColor(fortuneResult.luckScore)} bg-clip-text text-transparent mb-2 md:mb-4`} style={{ fontFamily: 'var(--font-yusei-magic)' }}>
                    {fortuneResult.luckLabel}
                  </div>

                  <div className="flex justify-center gap-1 mb-2 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles
                        key={i}
                        className={`w-5 h-5 md:w-8 md:h-8 ${
                          i < getStarCount(fortuneResult.luckScore)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-purple-100 text-base md:text-xl leading-relaxed" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                    {fortuneResult.luckMessage}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-purple-300 text-xs md:text-sm" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                    運勢スコア
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-yusei-magic)' }}>
                    {fortuneResult.luckScore.toFixed(1)} / 5.0
                  </p>
                </div>
              </motion.div>

              {/* 今日の名言 */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-purple-500/30"
              >
                <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-2 md:mb-4 flex items-center" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  今日の名言
                </h3>
                <blockquote className="border-l-4 border-purple-500 pl-3 md:pl-4 mb-2 md:mb-3">
                  <p className="text-purple-100 text-sm md:text-lg italic mb-1 md:mb-2" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                    「{fortuneResult.quote.text}」
                  </p>
                  <p className="text-purple-300 text-xs md:text-sm" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                    - {fortuneResult.quote.author}
                  </p>
                </blockquote>
                <p className="text-purple-200 text-xs md:text-sm bg-purple-900/30 rounded-lg p-2 md:p-3" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                  💡 {fortuneResult.quote.comment}
                </p>
              </motion.div>

              {/* 日常行動アドバイス */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-purple-500/30"
              >
                <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2 md:mb-3 flex items-center" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  🌟 日常行動アドバイス
                </h3>
                <p className="text-purple-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                  {fortuneResult.actionAdvice}
                </p>
              </motion.div>

              {/* 学習アドバイス */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-purple-500/30"
              >
                <h3 className="text-lg md:text-xl font-bold text-green-400 mb-2 md:mb-3 flex items-center" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  📚 学習アドバイス
                </h3>
                <p className="text-purple-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
                  {fortuneResult.studyAdvice}
                </p>
              </motion.div>

              {/* ラッキーアイテム */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/30"
              >
                <h3 className="text-lg md:text-xl font-bold text-pink-400 mb-2 md:mb-3 flex items-center" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  ✨ 今日のラッキーアイテム
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                  {fortuneResult.luckyItems.map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-3 md:p-4 text-center">
                      <p className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400" style={{ fontFamily: 'var(--font-rocknroll)' }}>
                        {item.adjective}{item.object}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* SNS共有ボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-2 md:p-6 shadow-xl border border-purple-500/30"
              >
                <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center justify-center" style={{ fontFamily: 'var(--font-mochiy-pop)' }}>
                  <Share2 className="w-5 h-5 mr-2" />
                  結果をシェアする
                </h3>
                <div className="flex flex-wrap justify-center gap-3 mb-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 sm:px-6 sm:py-3 rounded-lg transition-colors"
                    style={{ fontFamily: 'var(--font-mochiy-pop)' }}
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="hidden sm:inline">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('line')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 sm:px-6 sm:py-3 rounded-lg transition-colors"
                    style={{ fontFamily: 'var(--font-mochiy-pop)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    <span className="hidden sm:inline">LINE</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 sm:px-6 sm:py-3 rounded-lg transition-colors"
                    style={{ fontFamily: 'var(--font-mochiy-pop)' }}
                  >
                    📋
                    <span className="hidden sm:inline">コピー</span>
                  </button>
                </div>
              </motion.div>

              {/* もう一度占うボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pb-2 md:pb-4"
              >
                <button
                  onClick={handleReset}
                  className="bg-slate-700 hover:bg-slate-600 text-purple-200 font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg transition-colors text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-mochiy-pop)' }}
                >
                  もう一度占う
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
