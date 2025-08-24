// src/components/blog/BlogContent.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Blog, UserRole } from '@/lib/types/blog'
import { ViewCount } from './ViewCount'
import { ViewCounterPing } from './ViewCounterPing'
import TeaserOverlay from './TeaserOverlay'
import { SocialShareCompact } from './SocialShare'
import { 
  ArrowLeft,
  Calendar, 
  User, 
  Clock, 
  Tag as TagIcon,
  Folder,
  Share2,
  Bookmark,
  ChevronRight,
  Lock,
  Star,
  BookOpen
} from 'lucide-react'

interface BlogContentProps {
  slug: string
}

interface BlogDetailResponse {
  blog: Blog
  isTeaser: boolean
  canAccess: boolean
  userRole: UserRole
}

export default function BlogContent({ slug }: BlogContentProps) {
  const [data, setData] = useState<BlogDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/blogs/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('記事が見つかりませんでした')
        }
        throw new Error('記事の読み込みに失敗しました')
      }

      const blogData: BlogDetailResponse = await response.json()
      setData(blogData)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Basic HTML rendering (in a real app, you'd use a proper HTML parser/sanitizer)
    return { __html: content }
  }

  const getStatusBadge = (blog: Blog) => {
    if (blog.status === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          審査中
        </span>
      )
    }
    if (blog.status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          審査却下
        </span>
      )
    }
    if (blog.visibility === 'premium') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
          <Lock className="w-3 h-3 mr-1" />
          プレミアム
        </span>
      )
    }
    if (blog.visibility === 'teaser') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          <BookOpen className="w-3 h-3 mr-1" />
          ティザー
        </span>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || '記事が見つかりません'}
            </h1>
            <p className="text-gray-600 mb-6">
              お探しの記事は削除されたか、URLが正しくない可能性があります。
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              ブログ一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { blog, isTeaser, canAccess, userRole } = data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Counter */}
      <ViewCounterPing slug={blog.slug} role={userRole} />

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ブログ一覧に戻る
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <header className="p-8 pb-6 border-b border-gray-200">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(blog)}
                </div>
                <div className="flex items-center space-x-4">
                  <SocialShareCompact
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={blog.title}
                    description={blog.excerpt}
                    hashtags={blog.tags.slice(0, 3)}
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{blog.authorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTimeMins}分で読める</span>
                </div>
                <ViewCount count={blog.viewCount} />
              </div>

              {/* Categories and Tags */}
              {(blog.categories.length > 0 || blog.tags.length > 0) && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {/* Categories */}
                  {blog.categories.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-purple-500" />
                      <div className="flex flex-wrap gap-2">
                        {blog.categories.map((category) => (
                          <Link
                            key={category}
                            href={`/blog?category=${encodeURIComponent(category)}`}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full hover:bg-purple-200 transition-colors"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 text-blue-500" />
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </header>

          {/* Cover Image */}
          {blog.coverPath && (
            <div className="relative h-64 md:h-96">
              <img
                src={blog.coverPath}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8"
            >
              <div 
                className="prose prose-lg max-w-none text-gray-900 prose-headings:text-gray-900 prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-em:text-gray-700 prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900 prose-blockquote:text-gray-700"
                dangerouslySetInnerHTML={formatContent(blog.content || blog.excerpt)}
              />
            </motion.div>

            {/* Teaser Overlay */}
            {isTeaser && !canAccess && (
              <TeaserOverlay userRole={userRole} />
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">この記事は役に立ちましたか？</span>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Star className="w-4 h-4" />
                    <span>役に立った</span>
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                最終更新: {formatDate(blog.updatedAt)}
              </div>
            </div>
          </footer>
        </div>

        {/* Related Articles or Subscription CTA */}
        {isTeaser && !canAccess && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              続きを読むには
            </h3>
            <p className="text-gray-600 mb-6">
              この記事の続きをお読みいただくには、サブスクリプションプランにご加入ください。
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/subscription"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
              >
                <Lock className="w-5 h-5 mr-2" />
                サブスクリプションを始める
              </Link>
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                既にアカウントをお持ちですか？ログイン
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}