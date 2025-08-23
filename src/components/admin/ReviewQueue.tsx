// src/components/admin/ReviewQueue.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReviewItem from './ReviewItem'
import ReviewTemplateModal from './ReviewTemplateModal'
import { Blog, ReviewTemplate } from '@/lib/types/blog'
import { 
  Filter, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Folder
} from 'lucide-react'

interface ReviewQueueProps {
  initialBlogs?: Blog[]
}

export default function ReviewQueue({ initialBlogs = [] }: ReviewQueueProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templates, setTemplates] = useState<ReviewTemplate[]>([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    authorType: '',
    sortBy: 'createdAt'
  })

  useEffect(() => {
    fetchPendingBlogs()
    fetchTemplates()
  }, [])

  const fetchPendingBlogs = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        status: 'pending',
        pageSize: '50',
        ...filters
      })

      const response = await fetch(`/api/blogs?${params}`)
      
      if (!response.ok) {
        throw new Error('審査待ち記事の取得に失敗しました')
      }

      const data = await response.json()
      setBlogs(data.blogs)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll use mock data
      setTemplates([
        {
          id: 'usefulness',
          category: 'usefulness',
          title: '有益性不足',
          content: '具体的な手順や例示を追加してください。特に{section}の部分により詳細な説明が必要です。',
          isActive: true
        },
        {
          id: 'citation',
          category: 'citation',
          title: '引用・出典不備',
          content: '一次情報のURLを明記してください。参考にした資料の出典を適切に記載する必要があります。',
          isActive: true
        },
        {
          id: 'structure',
          category: 'structure',
          title: '構成・見出し',
          content: '見出しレベルを再構成してください。読みやすい記事構造になるよう見出しの階層を整理してください。',
          isActive: true
        }
      ])
    } catch (err) {
      console.error('テンプレート取得エラー:', err)
    }
  }

  const handleReview = async (blogId: string, action: 'approved' | 'rejected' | 'revise', comments?: string) => {
    try {
      const response = await fetch('/api/blogs/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          action,
          comments
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '審査処理に失敗しました')
      }

      // Remove the reviewed blog from the list
      setBlogs(prev => prev.filter(blog => blog.id !== blogId))
      setSelectedBlog(null)

      // Show success message (you could add a toast here)
      console.log('審査が完了しました')

    } catch (err) {
      setError(err instanceof Error ? err.message : '審査処理に失敗しました')
    }
  }

  const filteredBlogs = blogs.filter(blog => {
    if (filters.search && !blog.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category && !blog.categories.includes(filters.category)) {
      return false
    }
    if (filters.authorType && blog.authorType !== filters.authorType) {
      return false
    }
    return true
  })

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          エラーが発生しました
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchPendingBlogs}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          再試行
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">審査待ちキュー</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchPendingBlogs}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              テンプレート管理
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="記事タイトルで検索..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全カテゴリ</option>
            <option value="学習法">学習法</option>
            <option value="受験対策">受験対策</option>
            <option value="教育技術">教育技術</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">投稿日時順</option>
            <option value="title">タイトル順</option>
            <option value="author">著者順</option>
          </select>
        </div>
      </div>

      {/* Queue List */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              審査待ちの記事はありません
            </h3>
            <p className="text-gray-600">
              すべての記事の審査が完了しています。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{filteredBlogs.length}件の記事が審査待ちです</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>投稿日順</span>
                </span>
              </div>
            </div>

            <AnimatePresence>
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ReviewItem
                    blog={blog}
                    onReview={handleReview}
                    onSelect={() => setSelectedBlog(blog)}
                    templates={templates}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <ReviewTemplateModal
            templates={templates}
            onClose={() => setShowTemplateModal(false)}
            onSave={(updatedTemplates) => {
              setTemplates(updatedTemplates)
              setShowTemplateModal(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}