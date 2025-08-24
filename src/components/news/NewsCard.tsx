// src/components/news/NewsCard.tsx
'use client'

import { useRouter } from 'next/navigation'
import { News, NEWS_PRIORITY_CONFIG, NEWS_TYPE_CONFIG } from '@/lib/types/news'
import { 
  Calendar,
  Eye,
  ArrowRight,
  Clock
} from 'lucide-react'

interface NewsCardProps {
  news: News
}

export default function NewsCard({ news }: NewsCardProps) {
  const router = useRouter()

  const priorityConfig = NEWS_PRIORITY_CONFIG[news.priority]
  const typeConfig = NEWS_TYPE_CONFIG[news.type]

  const handleClick = () => {
    router.push(`/news/${news.id}`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const timeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return '今日'
    if (days === 1) return '1日前'
    if (days < 7) return `${days}日前`
    if (days < 30) return `${Math.floor(days / 7)}週間前`
    return formatDate(date)
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityConfig.borderColor} border-r border-t border-b border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-l-4 ${priorityConfig.borderColor.replace('border-', 'hover:border-l-')}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* ヘッダー情報 */}
          <div className="flex items-center space-x-3 mb-3">
            {/* 優先度バッジ */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
              {priorityConfig.label}
            </span>
            
            {/* タイプバッジ */}
            <span className="inline-flex items-center text-xs text-gray-600">
              <span className="mr-1">{typeConfig.icon}</span>
              {typeConfig.label}
            </span>

            {/* 新着バッジ */}
            {news.publishedAt && new Date().getTime() - news.publishedAt.getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                New
              </span>
            )}
          </div>

          {/* タイトル */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>

          {/* 抜粋 */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {news.excerpt}
          </p>

          {/* メタ情報 */}
          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {news.publishedAt ? timeAgo(news.publishedAt) : formatDate(news.createdAt)}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {news.viewCount}
            </span>
          </div>
        </div>

        {/* 右側のアイコン */}
        <div className="ml-4 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* 緊急・重要な場合の追加スタイル */}
      {(news.priority === 'urgent' || news.priority === 'high') && (
        <div className={`mt-4 p-2 rounded-md ${priorityConfig.bgColor} border ${priorityConfig.borderColor}`}>
          <div className="flex items-center">
            <Clock className={`w-4 h-4 mr-2 ${priorityConfig.textColor}`} />
            <span className={`text-xs font-medium ${priorityConfig.textColor}`}>
              {news.priority === 'urgent' ? '至急ご確認ください' : '重要なお知らせです'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}