// src/app/diagnosis/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useDiagnosis } from '@/hooks/useDiagnosis'
import { saveDiagnosisToUserProfile } from '@/lib/diagnosis'
import DiagnosisProgress from '@/components/diagnosis/DiagnosisProgress'
import QuestionCard from '@/components/diagnosis/QuestionCard'
import DiagnosisResultComponent from '@/components/diagnosis/DiagnosisResult'
import { DiagnosisResult } from '@/types/diagnosis'
import {
  Sparkles,
  User,
  UserCheck,
  ArrowRight,
  Play,
  Microscope,
  Info, Brain
} from 'lucide-react'
import Link from 'next/link'

export default function DiagnosisPage() {
  const { user, userData } = useAuth()
  const {
    session,
    currentQuestion,
    progress,
    isLoading,
    error,
    isActive,
    isCompleted,
    startDiagnosis,
    submitAnswer,
    getResult,
    resetDiagnosis,
    clearError
  } = useDiagnosis()

  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  // スクロール位置をリセットする関数
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 診断開始時にスクロールをリセット
  const handleStartDiagnosis = () => {
    startDiagnosis()
    setTimeout(() => scrollToTop(), 100) // 状態変更後にスクロール
  }

  // 診断完了時の処理
  useEffect(() => {
    if (isCompleted && !showResult) {
      const fetchResult = async () => {
        try {
          const diagnosisResult = await getResult()
          if (diagnosisResult) {
            setResult(diagnosisResult)
            setShowResult(true)
            
            // ログインユーザーの場合、結果をプロフィールに保存
            if (user && userData) {
              try {
                await saveDiagnosisToUserProfile(user.uid, diagnosisResult)
              } catch (error) {
                console.error('Failed to save diagnosis to profile:', error)
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch result:', error)
        }
      }
      
      fetchResult()
    }
  }, [isCompleted, showResult, getResult, user, userData])

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 md:p-4">
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg border border-red-200 p-4 md:p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-3 md:mb-4">
            <Brain className="w-10 h-10 md:w-12 md:h-12 mx-auto" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={clearError}
              className="w-full bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              もう一度試す
            </button>
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 結果表示
  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              🎉 診断完了！
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              あなたの学習タイプが判明しました
            </p>
          </motion.div>

          <DiagnosisResultComponent result={result} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-4 md:mt-8 text-center"
          >
            <button
              onClick={() => {
                setResult(null)
                setShowResult(false)
                resetDiagnosis()
                scrollToTop()
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
            >
              もう一度診断する
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // 診断中
  if (isActive && currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
          <DiagnosisProgress
            currentQuestion={progress.currentQuestion}
            totalQuestions={progress.totalQuestions}
            timeElapsed={progress.timeElapsed}
            className="mb-4 md:mb-8"
          />

          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={submitAnswer}
              isLoading={isLoading}
            />
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // 診断開始画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-12">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-2 sm:mb-6">
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-4">
            Lival AI
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              学習タイプ診断
            </span>
          </h1>
          <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto mb-2 md:mb-6">
            自己決定理論とBig Five性格理論に基づく科学的診断で、あなたに最適なAIコーチングスタイルを発見します
          </p>
          
          {/* 追加情報リンク */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm">
            <Link 
              href="/diagnosis/types" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Info className="w-4 h-4 mr-2" />
              6つの学習タイプとは？
            </Link>
            <span className="hidden sm:block text-gray-300">|</span>
            <Link 
              href="/about/science" 
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Microscope className="w-4 h-4 mr-2" />
              科学的根拠を詳しく
            </Link>
          </div>
        </motion.div>

        {/* 診断タイプ紹介 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-12"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-1 md:mb-8">6つの学習タイプ</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[
              { image: '/images/li-kun_val-chan/li-kun-EX-1.png', name: '探求家', color: 'text-purple-600', bg: 'bg-purple-100', desc: '好奇心・発見を重視', shortDesc: '好奇心重視' },
              { image: '/images/li-kun_val-chan/val-chan-ST-1.png', name: '戦略家', color: 'text-blue-600', bg: 'bg-blue-100', desc: '計画性・目標達成重視', shortDesc: '計画性重視' },
              { image: '/images/li-kun_val-chan/li-kun-AC-1.png', name: '努力家', color: 'text-green-600', bg: 'bg-green-100', desc: '承認・成長を大切に', shortDesc: '成長重視' },
              { image: '/images/li-kun_val-chan/li-kun-CH-1.png', name: '挑戦家', color: 'text-red-600', bg: 'bg-red-100', desc: '競争・スピードを追求', shortDesc: '競争重視' },
              { image: '/images/li-kun_val-chan/val-chan-SP-1.png', name: '伴走者', color: 'text-pink-600', bg: 'bg-pink-100', desc: '関係性・協調を重視', shortDesc: '協調重視' },
              { image: '/images/li-kun_val-chan/li-kun-OP-1.jpg', name: '効率家', color: 'text-amber-600', bg: 'bg-amber-100', desc: '実用性・効率を追求', shortDesc: '効率重視' }
            ].map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-6 text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-1 md:mb-3 relative">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    className="object-contain rounded-2xl"
                    sizes="(max-width: 768px) 32px, 48px"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-0.5 md:mb-2 text-sm md:text-base">{type.name}</h3>
                <p className="text-xs md:hidden text-gray-600">{type.shortDesc}</p>
                <p className="hidden md:block text-sm text-gray-600">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 診断情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8 mb-6 md:mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-4">診断について</h3>
              <ul className="space-y-0.5 md:space-y-3 text-gray-700">
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">質問数: 6-10問（約3-5分）</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">科学的根拠に基づく診断</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">正解・不正解はありません</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">直感で答えてOK</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-4">診断後にできること</h3>
              <ul className="space-y-0.5 md:space-y-3 text-gray-700">
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">パーソナライズされたAIコーチング</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">最適な学習方法の提案</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">強みを活かした学習計画</span>
                </li>
                <li className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">継続的な成長サポート</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ユーザー状態による表示分岐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          {user ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-center mb-4">
                <UserCheck className="w-4 h-4 md:w-8 md:h-8 text-green-600 mr-3" />
                <span className="text-md sm:text-lg font-semibold text-gray-900">
                  ログイン済み - 結果が保存されます
                </span>
              </div>
              <p className="text-gray-600 mb-2 sm:mb-6">
                診断結果はアカウントに保存され、いつでも確認できます
              </p>
              <button
                onClick={handleStartDiagnosis}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 md:space-x-3 mx-auto"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6" />
                <span>{isLoading ? '開始中...' : '診断を開始する'}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8">
              <div className="flex items-center justify-center mb-1md:mb-4">
                <User className="w-4 h-4 md:w-8 md:h-8 text-blue-600 mr-3" />
                <span className="text-md sm:text-lg font-semibold text-gray-900">
                  ゲストとして診断
                </span>
              </div>
              <p className="text-gray-600 mb-2 sm:mb-6">
                ログインなしでも診断できます（結果の保存には
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  アカウント作成
                </Link>
                が必要です）
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleStartDiagnosis}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 md:space-x-3"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{isLoading ? '開始中...' : 'ゲストとして診断開始'}</span>
                  <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
                </button>
                <div className="text-sm text-gray-500">
                  または
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                    ログイン
                  </Link>
                  ・
                  <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                    新規登録
                  </Link>
                  して結果を保存
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}