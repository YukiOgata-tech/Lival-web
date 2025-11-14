// src/app/blog/page.tsx
import { Suspense } from 'react'
import BlogList from '@/components/blog/BlogList'
import BlogFilters from '@/components/blog/BlogFilters'
import Link from 'next/link'
import { BookOpen, Search, Clock, PenTool, ArrowRight } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/data/blogCategories'
import { BlogService } from '@/lib/firebase/blog'
import { Metadata } from 'next'

// ISR setting: revalidate every 60 seconds for the main blog list page
export const revalidate = 60

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    q?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: '教育特化ブログ | Lival AI',
  description: '専門家やインフルエンサーによる質の高い教育コンテンツ。学習に役立つ実践的な情報をお届けします。',
  openGraph: {
    title: '教育特化ブログ | Lival AI',
    description: '専門家やインフルエンサーによる質の高い教育コンテンツ。学習に役立つ実践的な情報をお届けします。',
    url: 'https://www.lival.dev/blog',
    type: 'website',
    images: [
      {
        url: 'https://www.lival-ai.com/public/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lival AI Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '教育特化ブログ | Lival AI',
    description: '専門家やインフルエンサーによる質の高い教育コンテンツ。学習に役立つ実践的な情報をお届けします。',
    images: ['https://www.lival.dev/images/og-image.png'],
  },
}

// This is now a Server Component
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, q, page } = await searchParams
  const currentPage = parseInt(page || '1')

  const isFirstPage = currentPage === 1 && !category && !tag && !q

  const initialResult = isFirstPage
    ? await BlogService.getBlogs({
        page: 1,
        pageSize: 15,
        status: ['approved'],
      })
    : { blogs: [], lastDoc: null, hasMore: false }

  const initialPagination = {
    currentPage: 1,
    hasMore: initialResult.hasMore,
    totalCount: 0, // totalCount is not available from getBlogs, so we default to 0 for SSG
  }

  const categories = BLOG_CATEGORIES
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center relative">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full mb-3 sm:mb-5">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              教育特化ブログ
            </h1>
            <p className="text-sm sm:text-lg text-blue-100 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              専門家やインフルエンサーによる質の高い教育コンテンツ。
              学習に役立つ実践的な情報をお届けします。
            </p>
            <div className="mt-4 sm:mt-8">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<div>フィルターを読み込み中...</div>}>
                <BlogFilters 
                  categories={categories}
                  currentCategory={category}
                  currentTag={tag}
                  currentQuery={q}
                />
              </Suspense>
            </div>
          </aside>

          {/* Blog List */}
          <main className="lg:col-span-3">
            {(q || category || tag) && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-300 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 text-sm sm:text-base">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">
                    {q && `検索: "${q}"`}
                    {category && `カテゴリ: ${category}`}
                    {tag && `タグ: ${tag}`}
                  </span>
                </div>
              </div>
            )}

            <Suspense 
              fallback={
                <div className="space-y-6">
                  {[...Array(15)].map((_, i) => (
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
                initialBlogs={initialResult.blogs}
                initialPagination={isFirstPage ? initialPagination : undefined}
                category={category}
                tag={tag}
                query={q}
                page={currentPage}
              />
            </Suspense>
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/70 shadow-sm p-5 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              全ての記事を読むには
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-6 sm:mb-8">
              プレミアム記事や限定コンテンツにアクセスするには、
              サブスクリプションプランにご加入ください。
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center w-full sm:w-auto max-w-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                サブスクリプション詳細
              </Link>
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                既にアカウントをお持ちですか？ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
