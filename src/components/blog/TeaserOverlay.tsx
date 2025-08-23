// src/components/blog/TeaserOverlay.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserRole } from '@/lib/types/blog'
import { Lock, ArrowRight, Star, BookOpen } from 'lucide-react'

interface TeaserOverlayProps {
  userRole: UserRole
}

export default function TeaserOverlay({ userRole }: TeaserOverlayProps) {
  const isLoggedIn = userRole !== 'guest'
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white"></div>
      
      {/* Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* CTA Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 max-w-md mx-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            続きを読むには
          </h3>
          
          <p className="text-gray-600 mb-6">
            この記事の全文をお読みいただくには、
            {isLoggedIn ? 'サブスクリプション' : 'アカウント登録・ログイン'}が必要です。
          </p>

          {/* Benefits */}
          <div className="text-left space-y-2 mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">質の高い限定コンテンツ</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">専門家による詳しい解説</span>
            </div>
            <div className="flex items-center space-x-3">
              <ArrowRight className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">実践的な学習ノウハウ</span>
            </div>
          </div>

          <div className="space-y-3">
            {isLoggedIn ? (
              /* User is logged in but needs subscription */
              <>
                <Link
                  href="/subscription"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                >
                  サブスクリプションを始める
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <p className="text-xs text-gray-500">
                  月額980円から • いつでもキャンセル可能
                </p>
              </>
            ) : (
              /* User needs to sign up/login */
              <>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                >
                  無料で始める
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  既にアカウントをお持ちの方
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}