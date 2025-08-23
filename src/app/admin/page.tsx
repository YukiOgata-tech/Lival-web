// src/app/admin/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Shield, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Plus
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Lival AI',
  description: '管理者ダッシュボード',
  robots: 'noindex'
}

export default function AdminDashboard() {
  // Mock statistics data
  const stats = {
    totalBlogs: 127,
    pendingReviews: 8,
    totalUsers: 1234,
    monthlyViews: 45600,
    approvedToday: 5,
    rejectedToday: 1,
    averageReviewTime: '2.3 hours'
  }

  const recentActivity = [
    { id: 1, type: 'blog_approved', user: '田中太郎', title: 'Next.js 15の新機能', time: '2時間前' },
    { id: 2, type: 'blog_submitted', user: '佐藤花子', title: 'TypeScript活用術', time: '4時間前' },
    { id: 3, type: 'user_registered', user: '山田次郎', title: 'プレミアムプランに登録', time: '6時間前' },
    { id: 4, type: 'blog_rejected', user: '鈴木三郎', title: 'AI学習法の基礎', time: '8時間前' }
  ]

  const adminMenuItems = [
    {
      title: '記事審査',
      description: '投稿された記事の審査・管理',
      icon: FileText,
      href: '/admin/review',
      count: stats.pendingReviews,
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    },
    {
      title: 'ユーザー管理',
      description: 'ユーザーアカウントの管理',
      icon: Users,
      href: '/admin/users',
      count: stats.totalUsers,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'アナリティクス',
      description: 'サイト統計とレポート',
      icon: BarChart3,
      href: '/admin/analytics',
      count: stats.monthlyViews,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'カテゴリ管理',
      description: 'ブログカテゴリの設定',
      icon: Settings,
      href: '/admin/categories',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'テンプレート管理',
      description: '審査用テンプレートの管理',
      icon: MessageSquare,
      href: '/admin/templates',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'システム設定',
      description: 'サイト全般の設定',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-50 text-gray-600 border-gray-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
                <div className="flex items-center text-gray-600">
                  <Image
                    src="/images/header-livalAI.png"
                    alt="Lival AI"
                    width={80}
                    height={20}
                    className="h-4 w-auto mr-1"
                  />
                  システム管理
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                新規記事作成
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総記事数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                <p className="text-sm text-green-600">+12 今月</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">審査待ち</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</p>
                <p className="text-sm text-yellow-600">要対応</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600">+45 今週</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">月間PV</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
                <p className="text-sm text-green-600">+23% 先月比</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">管理メニュー</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`block p-4 border rounded-lg transition-colors hover:bg-gray-50 ${item.color}`}
                  >
                    <div className="flex items-start space-x-3">
                      <item.icon className="w-6 h-6 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        {item.count && (
                          <div className="text-sm font-medium">
                            {typeof item.count === 'number' ? item.count.toLocaleString() : item.count}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">最近のアクティビティ</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'blog_approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'blog_submitted' && <FileText className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'user_registered' && <Users className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'blog_rejected' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/admin/activity"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  すべてのアクティビティを表示 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/review"
              className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Clock className="w-4 h-4 mr-2" />
              審査待ち記事を確認
            </Link>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              今月のレポート
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              新規ユーザー管理
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              スタッフ記事作成
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}