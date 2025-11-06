'use client'

import Link from "next/link"

export default function SubscriptionInfoPage() {
  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">投稿機能はサブスク会員限定です</h1>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
          ブログの作成・投稿は有料プラン（basic／premium）または管理者のみ利用できます。
          プランをご確認のうえ、アップグレードいただくと記事の作成・審査提出が可能になります。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            ブログ一覧へ戻る
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
          >
            料金プランを見る
          </Link>
        </div>
      </div>
    </div>
  )
}
