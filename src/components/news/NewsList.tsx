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
  const [showSearch, setShowSearch] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="space-y-4 sm:space-y-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        {/* 背景装飾 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="hidden sm:block absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="hidden sm:block absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center mb-3 sm:mb-6"
        >
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Megaphone className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-0.5 sm:mb-3"
        >
          お知らせ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:block text-gray-600 sm:text-lg max-w-2xl mx-auto px-4 sm:px-0 sm:h-auto"
        >
          最新のお知らせやシステム情報をご確認いただけます
        </motion.p>
      </motion.div>h

      {/* モバイル: スティッキーフィルターバー */}
      <div className="sm:hidden sticky top-0 z-20 bg-white/90 backdrop-blur border-y border-gray-600">
        <video
              autoPlay loop muted playsInline disablePictureInPicture
              className="w-20 h-20 object-contain absolute -top-16.5 right-4 sm:hidden"
            >
               {/* iOS Safari用 - HEVCアルファ */}
               <source src="/webm/wall-5-ios.mov" type='video/quicktime; codecs="hvc1"' />
               {/* Chrome/Edge用 - WebM透過 */}
               <source src="/webm/wall-5.webm" type="video/webm" />
        </video>
        <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            aria-label="検索"
            onClick={() => setShowSearch(v => !v)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border ${showSearch ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700'}`}
          >
            <Search className="inline w-4 h-4 mr-1" />検索
          </button>
          {Object.entries(NEWS_TYPE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setFilters(prev => ({ ...prev, type: prev.type === type ? undefined : (type as NewsType) }))}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${filters.type === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              <span className="mr-1">{config.icon}</span>{config.label}
            </button>
          ))}
        </div>
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="キーワードで検索"
                className="w-full outline-none text-sm"
              />
              {searchTerm && (
                <button aria-label="検索クリア" onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">×</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 検索・フィルター */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="hidden sm:block bg-white rounded-xl shadow-md border border-gray-400 p-4 sm:p-6 backdrop-blur-sm"
      >
        
        <div className="flex flex-col sm:flex-row gap-4 relative">
          <video
              autoPlay loop muted playsInline disablePictureInPicture
              className="w-24 h-24 sm:w-48 sm:h-48 object-contain absolute hidden sm:block sm:-top-45.5 sm:right-4"
            >
               {/* iOS Safari用 - HEVCアルファ */}
               <source src="/webm/wall-5-ios.mov" type='video/quicktime; codecs="hvc1"' />
               {/* Chrome/Edge用 - WebM透過 */}
               <source src="/webm/wall-5.webm" type="video/webm" />
        </video>
          {/* 検索 */}
          <div className="flex-1">
            <div className="relative group border border-gray-500 rounded-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="お知らせを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
              />
            </div>
          </div>

          {/* フィルタートグル */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-gray-700 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            フィルター
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* フィルター詳細 */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilters({})}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  !filters.type
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                すべて
              </motion.button>
              {Object.entries(NEWS_TYPE_CONFIG).map(([type, config]) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilters({ type: type as NewsType })}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    filters.type === type
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* お知らせ一覧 */}
      {sortedNews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Megaphone className="mx-auto h-16 w-16 text-gray-400" />
          </motion.div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">お知らせがありません</h3>
          <p className="mt-2 text-sm text-gray-500">
            現在公開中のお知らせはありません
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4 sm:space-y-4 sm:space-y-6">
          {sortedNews.map((item, index) => (
            <NewsCard key={item.id} news={item} index={index} />
          ))}

          {/* もっと読む */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchNews(true)}
                disabled={loadingMore}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    もっと読む
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}




