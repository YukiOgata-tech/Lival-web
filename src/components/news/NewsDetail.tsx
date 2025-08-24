// src/components/news/NewsDetail.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { News, NEWS_PRIORITY_CONFIG, NEWS_TYPE_CONFIG } from '@/lib/types/news'
import { 
  ArrowLeft,
  Calendar,
  Eye,
  Clock,
  User
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* 戻るボタン */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* ヘッダー部分 */}
        <div className={`border-l-4 ${priorityConfig.borderColor} ${priorityConfig.bgColor} px-6 py-4`}>
          <div className="flex items-center space-x-3 mb-3">
            {/* 優先度バッジ */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.textColor} bg-white`}>
              {priorityConfig.label}
            </span>
            
            {/* タイプバッジ */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700">
              <span className="mr-2">{typeConfig.icon}</span>
              {typeConfig.label}
            </span>

            {/* 新着バッジ */}
            {news.publishedAt && new Date().getTime() - news.publishedAt.getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                New
              </span>
            )}
          </div>

          {/* 緊急・重要メッセージ */}
          {(news.priority === 'urgent' || news.priority === 'high') && (
            <div className="flex items-center mb-3">
              <Clock className={`w-4 h-4 mr-2 ${priorityConfig.textColor}`} />
              <span className={`text-sm font-medium ${priorityConfig.textColor}`}>
                {news.priority === 'urgent' ? '至急ご確認ください' : '重要なお知らせです'}
              </span>
            </div>
          )}

          {/* タイトル */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {news.title}
          </h1>
        </div>

        {/* メタ情報 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>公開日: {news.publishedAt ? formatDate(news.publishedAt) : '未公開'}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>投稿者: {news.authorName}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>閲覧数: {news.viewCount}</span>
            </div>
          </div>
        </div>

        {/* 本文 */}
        <div className="px-6 py-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        {/* フッター */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
            <div>
              <p>作成日: {formatDate(news.createdAt)}</p>
              <p>最終更新: {formatDate(news.updatedAt)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/news')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                お知らせ一覧に戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}