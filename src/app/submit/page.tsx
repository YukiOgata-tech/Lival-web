// src/app/submit/page.tsx
import { Metadata } from 'next'
import BlogSubmitForm from '@/components/blog/BlogSubmitForm'
import { PenTool, BookOpen, FileText } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/data/blogCategories'

export const metadata: Metadata = {
  title: 'ブログ投稿 | Lival AI',
  description: 'Lival AIブログに記事を投稿する。教育に関する有益なコンテンツを作成・公開しましょう。',
  robots: 'noindex' // Submission pages shouldn't be indexed
}

export default async function SubmitPage() {
  // 教育分野のカテゴリを共通定義から読み込み
  const categories = BLOG_CATEGORIES
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ブログ記事を投稿
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              あなたの知識と経験を共有し、学習者の役に立つコンテンツを作成しましょう。
              すべての記事は品質確保のため審査を経て公開されます。
            </p>
          </div>
        </div>
      </div>

      {/* Submission Guidelines */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            投稿ガイドライン
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">✅ 推奨される内容</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• 教育・学習に関する実践的な内容</li>
                <li>• 具体的な手順や例を含む記事</li>
                <li>• オリジナルの体験や知見</li>
                <li>• 正確な情報と適切な引用</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">❌ 避けるべき内容</h3>
              <ul className="space-y-1 text-red-700">
                <li>• 教育と無関係な内容</li>
                <li>• 他者の著作権を侵害する内容</li>
                <li>• 事実誤認や誤解を招く表現</li>
                <li>• 宣伝・営業目的のみの内容</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <BlogSubmitForm categories={categories} userRole="admin" />
        </div>

        {/* Process Information */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            公開までの流れ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">記事作成・投稿</h3>
              <p className="text-sm text-gray-600">
                エディターで記事を作成し、審査申請を行います
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">編集部審査</h3>
              <p className="text-sm text-gray-600">
                品質・正確性・権利関係の確認（通常1-3日）
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">公開・収益化</h3>
              <p className="text-sm text-gray-600">
                承認後、サイトで公開され閲覧可能になります
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
