// src/components/news/NewsCard.tsx
'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { News, NEWS_PRIORITY_CONFIG, NEWS_TYPE_CONFIG } from '@/lib/types/news'
import {
  Calendar,
  Eye,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react'

interface NewsCardProps {
  news: News
  index?: number
}

export default function NewsCard({ news, index = 0 }: NewsCardProps) {
  const router = useRouter()

  const priorityConfig = NEWS_PRIORITY_CONFIG[news.priority]
  const typeConfig = NEWS_TYPE_CONFIG[news.type]

  const handleClick = () => {
    router.push(`/news/${news.id}`)
  }

  const formatDate = (date: Date | string | { _seconds?: number; seconds?: number; _nanoseconds?: number; nanoseconds?: number }) => {
    let d: Date

    // Firestore Timestamp オブジェクトの場合
    if (date && typeof date === 'object' && ('_seconds' in date || 'seconds' in date)) {
      const seconds = (date as { _seconds?: number; seconds?: number })._seconds || (date as { _seconds?: number; seconds?: number }).seconds || 0
      d = new Date(seconds * 1000)
    } else {
      d = new Date(date as string | Date)
    }

    // Invalid Dateチェック
    if (isNaN(d.getTime())) {
      return '日付不明'
    }

    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const timeAgo = (date: Date | string | { _seconds?: number; seconds?: number; _nanoseconds?: number; nanoseconds?: number }) => {
    let d: Date

    // Firestore Timestamp オブジェクトの場合
    if (date && typeof date === 'object' && ('_seconds' in date || 'seconds' in date)) {
      const seconds = (date as { _seconds?: number; seconds?: number })._seconds || (date as { _seconds?: number; seconds?: number }).seconds || 0
      d = new Date(seconds * 1000)
    } else {
      d = new Date(date as string | Date)
    }

    // Invalid Dateチェック
    if (isNaN(d.getTime())) {
      return '日付不明'
    }

    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今日'
    if (days === 1) return '1日前'
    if (days < 7) return `${days}日前`
    if (days < 30) return `${Math.floor(days / 7)}週間前`
    return formatDate(date)
  }

  const isNew = news.publishedAt && (() => {
    const publishedDate = news.publishedAt instanceof Date
      ? news.publishedAt
      : new Date(news.publishedAt);
    return new Date().getTime() - publishedDate.getTime() < 7 * 24 * 60 * 60 * 1000;
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className={`group relative bg-transparent rounded-xl shadow-sm border-l-4 ${priorityConfig.borderColor} border ${NEWS_TYPE_CONFIG[news.type].cardBorder} p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      {/* 背景グラデーション（優先度に応じて） */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${
        news.priority === 'urgent' ? 'bg-gradient-to-br from-rose-300 to-rose-500' :
        news.priority === 'high' ? 'bg-gradient-to-br from-amber-300 to-amber-500' :
        'bg-gradient-to-br from-indigo-300 to-indigo-600'
      } rounded-full blur-3xl`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* ヘッダー情報 */}
          <div className="flex items-center flex-wrap gap-2 mb-2 sm:mb-3">
            {/* 優先度バッジ */}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${priorityConfig.bgColor} ${priorityConfig.textColor} border ${priorityConfig.borderColor}`}
            >
              {news.priority === 'urgent' && <Sparkles className="w-3 h-3 mr-1" />}
              {priorityConfig.label}
            </motion.span>

            {/* タイプバッジ */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              <span className="mr-1.5">{typeConfig.icon}</span>
              {typeConfig.label}
            </span>

            {/* 新着バッジ */}
            {isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                NEW
              </motion.span>
            )}
          </div>

          {/* タイトル */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {news.title}
          </h3>

          {/* 抜粋 */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 sm:line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>

          {/* メタ情報 */}
          <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {news.publishedAt ? timeAgo(news.publishedAt instanceof Date ? news.publishedAt : new Date(news.publishedAt)) : formatDate(news.createdAt)}
            </span>
            <span className="flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              {news.viewCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 右側のアイコン */}
        <div className="ml-4 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm"
          >
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </div>
      </div>

      {/* 緊急・重要な場合の追加スタイル */}
      {(news.priority === 'urgent' || news.priority === 'high') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-3 rounded-lg ${priorityConfig.bgColor} border ${priorityConfig.borderColor} backdrop-blur-sm`}
        >
          <div className="flex items-center">
            <Clock className={`w-4 h-4 mr-2 ${priorityConfig.textColor}`} />
            <span className={`text-xs font-semibold ${priorityConfig.textColor}`}>
              {news.priority === 'urgent' ? '⚡ 至急ご確認ください' : '📌 重要なお知らせです'}
            </span>
          </div>
        </motion.div>
      )}

      {/* ホバー時のボーダー効果 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
    </motion.div>
  )
}




