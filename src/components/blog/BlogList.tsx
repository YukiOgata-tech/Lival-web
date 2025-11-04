// src/components/blog/BlogList.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Blog, UserRole } from '@/lib/types/blog'
import { ViewCount } from './ViewCount'
import { SocialShareCompact } from './SocialShare'
import { 
  Calendar, 
  User, 
  Clock, 
  Lock, 
  ChevronRight,
  BookOpen,
  Tag as TagIcon
} from 'lucide-react'

interface BlogListProps {
  category?: string
  tag?: string
  query?: string
  page?: number
}

interface BlogListResponse {
  blogs: (Blog & { isTeaser: boolean })[]
  pagination: {
    currentPage: number
    hasMore: boolean
    totalCount: number
  }
}

export default function BlogList({ category, tag, query, page = 1 }: BlogListProps) {
  const [blogs, setBlogs] = useState<(Blog & { isTeaser: boolean })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasMore: false,
    totalCount: 0
  })

  useEffect(() => {
    fetchBlogs()
  }, [category, tag, query, page])

  const fetchBlogs = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (tag) params.append('tag', tag)
      if (query) params.append('q', query)
      params.append('page', page.toString())
      params.append('pageSize', '12')

      const response = await fetch(`/api/blogs?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }

      const data: BlogListResponse = await response.json()
      setBlogs(data.blogs)
      setPagination(data.pagination)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getVisibilityIcon = (blog: Blog & { isTeaser: boolean }) => {
    if (blog.visibility === 'premium') {
      return <Lock className="w-4 h-4 text-amber-500" />
    }
    if (blog.isTeaser) {
      return <BookOpen className="w-4 h-4 text-blue-500" />
    }
    return null
  }

  const getVisibilityBadge = (blog: Blog & { isTeaser: boolean }) => {
    if (blog.visibility === 'premium') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
          <Lock className="w-3 h-3 mr-1" />
          プレミアム
        </span>
      )
    }
    if (blog.isTeaser) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          <BookOpen className="w-3 h-3 mr-1" />
          ティザー
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        無料
      </span>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            エラーが発生しました
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchBlogs}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          記事が見つかりませんでした
        </h3>
        <p className="text-gray-600">
          {query || category || tag 
            ? '検索条件を変更して再度お試しください。'
            : 'まだ記事が投稿されていません。'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {pagination.totalCount > 0 && (
            <span>{pagination.totalCount}件の記事が見つかりました</span>
          )}
        </p>
      </div>

      {/* Blog Cards */}
      <div className="space-y-4 sm:space-y-6">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <Link href={`/blog/${blog.slug}`} className="block">
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{blog.authorName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTimeMins}分</span>
                      </div>
                      <ViewCount count={blog.viewCount} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-3 sm:ml-4">
                    {getVisibilityBadge(blog)}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-gray-700 line-clamp-2 sm:line-clamp-3 leading-relaxed text-sm sm:text-base">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Categories and Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:space-x-3">
                    {/* Categories */}
                    {blog.categories.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {blog.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-800 text-[11px] sm:text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {blog.categories.length > 2 && (
                          <span className="text-[11px] sm:text-xs text-gray-500">
                            +{blog.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <TagIcon className="w-3 h-3 text-gray-400" />
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-[11px] sm:text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-[11px] sm:text-xs text-gray-500">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {getVisibilityIcon(blog)}
                </div>
              </div>
            </Link>
            
            {/* Share buttons outside of link */}
            <div className="px-4 sm:px-6 pb-3 sm:pb-4 border-t border-gray-100">
              <div className="flex items-center justify-between pt-2 sm:pt-3">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <ViewCount count={typeof blog.viewCount === 'number' ? blog.viewCount : 0} />
                </div>
                <SocialShareCompact
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${blog.slug}`}
                  title={blog.title}
                  description={blog.excerpt}
                  hashtags={blog.tags.slice(0, 3)}
                />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Pagination */}
      {pagination.hasMore && (
        <div className="text-center pt-8">
          <Link
            href={`/blog?${new URLSearchParams({
              ...(category && { category }),
              ...(tag && { tag }),
              ...(query && { q: query }),
              page: (pagination.currentPage + 1).toString()
            })}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            さらに読み込む
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      )}
    </div>
  )
}
