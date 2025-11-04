// src/app/admin/review/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import ReviewQueue from '@/components/admin/ReviewQueue'
import { Shield, FileText, Clock } from 'lucide-react'
import { adminDb } from '@/lib/firebase-admin'

export const metadata: Metadata = {
  title: '記事審査 | Admin - Lival AI',
  description: '投稿された記事の審査・管理画面',
  robots: 'noindex'
}

export default function AdminReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">記事審査管理</h1>
              <p className="text-sm sm:text-base text-gray-600">投稿された記事の品質確認と審査を行います</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <Suspense fallback={<StatsSkeletons />}>
          <ReviewStats />
        </Suspense>
      </div>

      {/* Review Queue */}
      <div className="max-w-7xl mx-auto px-4 pb-6 sm:pb-8">
        <Suspense fallback={<QueueSkeleton />}>
          <ReviewQueue />
        </Suspense>
      </div>
    </div>
  )
}

// Stats component（サーバーサイドで実数を取得）
async function ReviewStats() {
  let pending = 0
  let approved = 0
  let rejected = 0
  let averageTime = '-'

  if (adminDb) {
    try {
      const [p, a, r] = await Promise.all([
        adminDb.collection('blogs').where('status', '==', 'pending').count().get(),
        adminDb.collection('blogs').where('status', '==', 'approved').count().get(),
        adminDb.collection('blogs').where('status', '==', 'rejected').count().get(),
      ])
      pending = (p.data() as any).count || 0
      approved = (a.data() as any).count || 0
      rejected = (r.data() as any).count || 0
    } catch (e) {
      // count() が未サポートの場合のフォールバック
      const snap = await adminDb.collection('blogs').limit(200).get()
      const list = snap.docs.map(d => d.data() as any)
      pending = list.filter(b => b.status === 'pending').length
      approved = list.filter(b => b.status === 'approved').length
      rejected = list.filter(b => b.status === 'rejected').length
    }
    // TODO: 平均審査時間は blog_submissions の submittedAt と approvedAt から算出
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">審査待ち</p>
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          </div>
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">承認済み</p>
            <p className="text-2xl font-bold text-green-600">{approved}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">却下</p>
            <p className="text-2xl font-bold text-red-600">{rejected}</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">平均審査時間</p>
            <p className="text-2xl font-bold text-blue-600">{averageTime}日</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeletons
function StatsSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function QueueSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
