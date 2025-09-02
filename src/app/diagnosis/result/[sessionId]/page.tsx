// src/app/diagnosis/result/[sessionId]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { getDiagnosisResult } from '@/lib/diagnosis'
import { DiagnosisResult as DiagnosisResultType } from '@/types/diagnosis'
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult'
import { Brain, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'

// OGP用の画像URL生成
const generateOGImageUrl = (result: DiagnosisResultType) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const params = new URLSearchParams({
    type: result.primaryType.id,
    displayName: result.primaryType.displayName,
    confidence: result.confidence.toString(),
    description: result.primaryType.description
  })
  return `${baseUrl}/api/og/diagnosis?${params.toString()}`
}

export default function SharedDiagnosisResultPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [result, setResult] = useState<DiagnosisResultType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      if (!sessionId) {
        setError('無効なセッションIDです')
        setLoading(false)
        return
      }

      try {
        const diagnosisResult = await getDiagnosisResult(sessionId)
        if (!diagnosisResult) {
          setError('結果が見つかりません。診断が完了していない可能性があります。')
        } else {
          setResult(diagnosisResult)
        }
      } catch (err) {
        console.error('Failed to fetch diagnosis result:', err)
        setError('結果の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [sessionId])

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-lg text-gray-600">診断結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">結果が見つかりません</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/diagnosis"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新しく診断を受ける
            </Link>
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const ogImageUrl = generateOGImageUrl(result)
  const shareTitle = `私の学習タイプは「${result.primaryType.displayName}」でした！`
  const shareDescription = `${result.primaryType.description} | LIVAL AI 診断結果（信頼度: ${result.confidence}%）`

  return (
    <>
      <Head>
        <title>{shareTitle} | LIVAL AI</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="LIVAL AI" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="twitter:title" content={shareTitle} />
        <meta property="twitter:description" content={shareDescription} />
        <meta property="twitter:image" content={ogImageUrl} />
        
        {/* LINE */}
        <meta property="line:title" content={shareTitle} />
        <meta property="line:description" content={shareDescription} />
        <meta property="line:image" content={ogImageUrl} />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 md:mb-8"
        >
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <Link
              href="/diagnosis"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              新しく診断する
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            📊 診断結果
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            LIVAL AI 学習タイプ診断結果
          </p>
        </motion.div>

        {/* 結果表示 */}
        <DiagnosisResult result={result} showActions={false} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-4 md:mt-8 text-center bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">
            あなたも診断してみませんか？
          </h3>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            LIVAL AIであなたに最適な学習タイプを発見しましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/diagnosis"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <Brain className="w-4 h-4 md:w-5 md:h-5" />
              <span>無料で診断を始める</span>
            </Link>
            <Link
              href="/signup"
              className="border border-gray-300 text-gray-700 py-2.5 md:py-3 px-4 md:px-6 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              AIコーチングを始める
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  )
}