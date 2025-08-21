'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Brain, 
  Construction, 
  Home, 
  ArrowLeft, 
  Search,
  Clock,
  Sparkles
} from 'lucide-react'

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Construction className="w-16 h-16 text-white" />
            </div>
            {isMounted && (
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-gray-900" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            ページが見つかりません
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-gray-700 font-medium">開発中・準備中</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              お探しのページは存在しないか、現在開発中です。
              LIVAL AIでは日々新しい機能を開発しており、
              近日中に公開予定です。
            </p>
            <div className="flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-500">
                AIが24時間体制で開発を支援中...
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          {/* Primary Action */}
          <Link
            href="/"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full justify-center"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            ホームに戻る
          </Link>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              前のページ
            </button>
            
            <Link
              href="/contact"
              className="group inline-flex items-center px-6 py-3 border-2 border-blue-300 text-blue-700 font-medium rounded-full hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 justify-center"
            >
              <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              お問い合わせ
            </Link>
          </div>
        </motion.div>

        {/* Fun Message */}
        {isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 p-4 bg-blue-50/80 rounded-xl border border-blue-200/50"
          >
            <p className="text-sm text-blue-700">
              💡 ヒント: URLを再確認するか、ナビゲーションメニューからお探しください
            </p>
          </motion.div>
        )}

        {/* Floating Animation */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-blue-300/30 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}