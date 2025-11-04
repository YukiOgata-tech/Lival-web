// src/app/blog/page.tsx
'use client'
import { Suspense, use, useState } from 'react'
import BlogList from '@/components/blog/BlogList'
import BlogFilters from '@/components/blog/BlogFilters'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { BookOpen, Search, Clock, PenTool, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BLOG_CATEGORIES } from '@/data/blogCategories'


interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    q?: string
    page?: string
  }>
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const { user, userData } = useAuth()
  const params = use(searchParams)
  const router = useRouter()

  // Mobile toolbar state (compact search + quick chips)
  const [mobileQuery, setMobileQuery] = useState(params.q || '')
  
  // 共有カテゴリ定義（src/data/blogCategories）
  const categories = BLOG_CATEGORIES
  const currentPage = parseInt(params.page || '1')
  
  // Check if user is premium (not free plan)
  const isFreePlan = !userData || userData.subscription.plan === 'free_web'
  const isPremiumUser = user && userData && !isFreePlan
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center relative">
            {/* Blog posting button for premium users */}
            {isPremiumUser && (
              <div className="hidden sm:block absolute top-0 right-0">
                <Link
                  href="/submit"
                  className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 font-medium border border-white/30"
                >
                  <PenTool className="w-5 h-5 mr-2" />
                  記事を投稿
                </Link>
              </div>
            )}
            
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-4 sm:mb-6">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              教育特化ブログ
            </h1>
            <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto">
              専門家やインフルエンサーによる質の高い教育コンテンツ。
              学習に役立つ実践的な情報をお届けします。
            </p>
            <div className="mt-8">
              <Link
                href="/blog/about"
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors"
              >
                ブログの仕組みについて詳しく見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toolbar: 検索 + クイックチップ */}
      <div className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const q = mobileQuery.trim()
              const sp = new URLSearchParams()
              if (q) sp.set('q', q)
              router.push(sp.toString() ? `/blog?${sp.toString()}` : '/blog')
            }}
          >
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="記事を検索"
                className="w-full outline-none text-sm"
              />
              {mobileQuery && (
                <button
                  aria-label="検索クリア"
                  type="button"
                  onClick={() => setMobileQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* popular tags as quick chips */}
          <div className="mt-3 overflow-x-auto no-scrollbar flex gap-2">
            {['学習法','記憶術','集中力','モチベーション','時間管理','受験対策','英語学習','数学','読書法'].map(tag => (
              <button
                key={tag}
                onClick={() => router.push(`/blog?${new URLSearchParams({ q: tag }).toString()}`)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<div>フィルターを読み込み中...</div>}>
                <BlogFilters 
                  categories={categories}
                  currentCategory={params.category}
                  currentTag={params.tag}
                  currentQuery={params.q}
                />
              </Suspense>
            </div>
          </aside>

          {/* Blog List */}
          <main className="lg:col-span-3">
            {/* Search Summary */}
            {(params.q || params.category || params.tag) && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 text-sm sm:text-base">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">
                    {params.q && `検索: "${params.q}"`}
                    {params.category && `カテゴリ: ${params.category}`}
                    {params.tag && `タグ: ${params.tag}`}
                  </span>
                </div>
              </div>
            )}

            <Suspense 
              fallback={
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
              }
            >
              <BlogList 
                category={params.category}
                tag={params.tag}
                query={params.q}
                page={currentPage}
              />
            </Suspense>
          </main>
        </div>
      </div>

      {/* CTA Section for Non-Subscribers */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            全ての記事を読むには
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            プレミアム記事や限定コンテンツにアクセスするには、
            サブスクリプションプランにご加入ください。
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/pricing"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              サブスクリプション詳細
            </a>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              いつでもキャンセル可能
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
