// src/components/news/NewsDetail.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { News, NEWS_PRIORITY_CONFIG, NEWS_TYPE_CONFIG } from '@/lib/types/news'
import {
  ArrowLeft,
  Calendar,
  Eye,
  Clock,
  User,
  Sparkles
} from 'lucide-react'

interface NewsDetailProps {
  news: News
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const router = useRouter()
  
  const priorityConfig = NEWS_PRIORITY_CONFIG[news.priority]
  const typeConfig = NEWS_TYPE_CONFIG[news.type]

  // 閲覧数を増加
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await fetch(`/api/news/${news.id}?view=true`)
      } catch (error) {
        console.error('Error incrementing view count:', error)
      }
    }

    incrementViewCount()
  }, [news.id])

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isNew = news.publishedAt && (() => {
    const publishedDate = news.publishedAt instanceof Date
      ? news.publishedAt
      : new Date(news.publishedAt);
    return new Date().getTime() - publishedDate.getTime() < 7 * 24 * 60 * 60 * 1000;
  })()

  return (
    <article className="max-w-4xl mx-auto">
      {/* 戻るボタン */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </motion.button>
      </motion.div>

      {/* メインコンテンツ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* ヘッダー部分 */}
        <div className={`relative border-l-4 ${priorityConfig.borderColor} ${priorityConfig.bgColor} px-8 py-6 overflow-hidden`}>
          {/* 背景装飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {/* 優先度バッジ */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${priorityConfig.textColor} bg-white`}
              >
                {news.priority === 'urgent' && <Sparkles className="w-4 h-4 mr-1.5" />}
                {priorityConfig.label}
              </motion.span>

              {/* タイプバッジ */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-gray-700 shadow-md"
              >
                <span className="mr-2 text-base">{typeConfig.icon}</span>
                {typeConfig.label}
              </motion.span>

              {/* 新着バッジ */}
              {isNew && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  NEW
                </motion.span>
              )}
            </div>

            {/* 緊急・重要メッセージ */}
            {(news.priority === 'urgent' || news.priority === 'high') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center mb-4 p-3 rounded-lg bg-white/50 backdrop-blur-sm"
              >
                <Clock className={`w-5 h-5 mr-2 ${priorityConfig.textColor}`} />
                <span className={`text-sm font-bold ${priorityConfig.textColor}`}>
                  {news.priority === 'urgent' ? '⚡ 至急ご確認ください' : '📌 重要なお知らせです'}
                </span>
              </motion.div>
            )}

            {/* タイトル */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            >
              {news.title}
            </motion.h1>
          </motion.div>
        </div>

        {/* メタ情報 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-8 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200"
        >
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">公開日:</span>
              <span className="ml-1">{news.publishedAt ? formatDate(news.publishedAt) : '未公開'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">投稿者:</span>
              <span className="ml-1">{news.authorName}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Eye className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">閲覧数:</span>
              <span className="ml-1 font-semibold text-blue-600">{news.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* 本文 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="px-8 py-10"
        >
          <div
            className="prose prose-lg max-w-none text-gray-900 prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:font-semibold prose-strong:text-gray-900 prose-em:text-gray-700 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-li:leading-relaxed prose-blockquote:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-2"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </motion.div>

        {/* フッター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-gray-600 space-y-1">
              <p className="flex items-center">
                <span className="font-semibold mr-2">作成日:</span>
                {formatDate(news.createdAt)}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">最終更新:</span>
                {formatDate(news.updatedAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/news')}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                お知らせ一覧に戻る
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </article>
  )
}