// src/components/news/NewsAdminList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  News, 
  NewsFilter, 
  NewsStatus,
  NewsType,
  NewsPriority,
  NewsListResponse,
  NEWS_PRIORITY_CONFIG,
  NEWS_TYPE_CONFIG 
} from '@/lib/types/news'
import { 
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Globe,
  FileText,
  Archive,
  AlertTriangle,
  MoreVertical
} from 'lucide-react'

export default function NewsAdminList() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<NewsFilter>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedNews, setSelectedNews] = useState<string | null>(null)

  // お知らせ一覧を取得
  const fetchNews = async () => {
    try {
      const params = new URLSearchParams({
        admin: 'true',
        limit: '50'
      })

      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.priority) params.append('priority', filters.priority)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/news?${params}`)
      if (!response.ok) throw new Error('Failed to fetch news')

      const data: NewsListResponse = await response.json()

      // DateオブジェクトをJSON文字列から復元
      const newsWithDates = data.news.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : null
      }))

      setNews(newsWithDates)
    } catch (error) {
      console.error('Error fetching news:', error)
      alert('お知らせの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [filters, searchTerm])

  // お知らせ削除
  const handleDelete = async (id: string) => {
    if (!confirm('このお知らせを削除しますか？')) return

    try {
      // クライアント側から直接Firestoreで削除
      const { deleteNews } = await import('@/lib/firebase/news')
      await deleteNews(id)

      alert('お知らせを削除しました')
      fetchNews()
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('削除に失敗しました')
    }
  }

  // ステータス表示コンポーネント
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      published: { label: '公開中', color: 'bg-green-100 text-green-800', icon: Globe },
      draft: { label: '下書き', color: 'bg-gray-100 text-gray-800', icon: FileText },
      archived: { label: 'アーカイブ', color: 'bg-yellow-100 text-yellow-800', icon: Archive }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: FileText }

    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  // 優先度表示コンポーネント
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const config = NEWS_PRIORITY_CONFIG[priority as keyof typeof NEWS_PRIORITY_CONFIG]
    if (!config) return null

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">お知らせ管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            お知らせの作成・編集・管理を行います
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/news/create')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          新規作成
        </button>
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
                placeholder="タイトルや内容で検索..."
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: (e.target.value as NewsStatus) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">全て</option>
                  <option value="published">公開中</option>
                  <option value="draft">下書き</option>
                  <option value="archived">アーカイブ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイプ
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: (e.target.value as NewsType) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">全て</option>
                  {Object.entries(NEWS_TYPE_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: (e.target.value as NewsPriority) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">全て</option>
                  {Object.entries(NEWS_PRIORITY_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* お知らせ一覧 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">お知らせがありません</h3>
            <p className="mt-1 text-sm text-gray-500">最初のお知らせを作成してみましょう</p>
            <button
              onClick={() => router.push('/admin/news/create')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              新規作成
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <StatusBadge status={item.status} />
                        <PriorityBadge priority={item.priority} />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span className="flex items-center">
                          {NEWS_TYPE_CONFIG[item.type].icon} {NEWS_TYPE_CONFIG[item.type].label}
                        </span>
                        <span>作成: {item.createdAt.toLocaleDateString('ja-JP')}</span>
                        {item.publishedAt && (
                          <span>公開: {item.publishedAt.toLocaleDateString('ja-JP')}</span>
                        )}
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {item.viewCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/news/${item.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="プレビュー"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/news/${item.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="編集"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}