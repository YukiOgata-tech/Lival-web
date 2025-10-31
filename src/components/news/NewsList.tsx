// src/components/news/NewsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NewsCard from './NewsCard'
import { News, NewsListResponse, NewsFilter, NewsType, NEWS_TYPE_CONFIG } from '@/lib/types/news'
import { 
  Megaphone,
  Filter,
  Search,
  ChevronDown,
  Loader2
} from 'lucide-react'

export default function NewsList() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<NewsFilter>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // お知らせ一覧を取得
  const fetchNews = async (append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        limit: '20'
      })

      if (filters.type) params.append('type', filters.type)
      if (searchTerm) params.append('search', searchTerm)
      // デバッグのためすべてのstatusを取得
      params.append('status', 'all')

      console.log('Fetching news with params:', params.toString())
      const response = await fetch(`/api/news?${params}`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error:', errorData)
        throw new Error(`API Error: ${response.status} - ${errorData}`)
      }

      const data: NewsListResponse = await response.json()
      console.log('Received data:', data)

      // DateオブジェクトをJSON文字列から復元
      const newsWithDates = data.news.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : null
      }))

      if (append) {
        setNews(prev => [...prev, ...newsWithDates])
      } else {
        setNews(newsWithDates)
      }
      
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching news:', error)
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
      alert(`お知らせの取得に失敗しました: ${errorMessage}`)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [filters, searchTerm])

  // 優先度によるソート（urgent > high > normal > low）
  const sortedNews = [...news].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
    const aPriority = priorityOrder[a.priority] || 0
    const bPriority = priorityOrder[b.priority] || 0
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // 優先度が同じ場合は公開日時でソート
    return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">お知らせ</h1>
        <p className="text-gray-600">
          最新のお知らせやシステム情報をご確認いただけます
        </p>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 検索 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="お知らせを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* フィルタートグル */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            フィルター
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* フィルター詳細 */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setFilters({})}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !filters.type 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {Object.entries(NEWS_TYPE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setFilters({ type: type as NewsType })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.type === type 
                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.icon} {config.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* お知らせ一覧 */}
      {sortedNews.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">お知らせがありません</h3>
          <p className="mt-1 text-sm text-gray-500">
            現在公開中のお知らせはありません
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NewsCard news={item} />
            </motion.div>
          ))}

          {/* もっと読む */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={() => fetchNews(true)}
                disabled={loadingMore}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>もっと読む</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}