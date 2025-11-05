// src/components/admin/AdminLayout.tsx
'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { 
  Shield,
  FileText,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Megaphone,
  ArrowLeft,
  Home,
  Menu,
  X,
  Crown,
  LogOut
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const adminMenuItems = [
  {
    name: 'ダッシュボード',
    href: '/admin',
    icon: BarChart3,
    description: 'システム統計・概要'
  },
  {
    name: 'お知らせ管理',
    href: '/admin/news',
    icon: Megaphone,
    description: 'お知らせの作成・編集・管理'
  },
  {
    name: '記事審査',
    href: '/admin/review',
    icon: FileText,
    description: '投稿された記事の審査・管理'
  },
  {
    name: 'ユーザー管理',
    href: '/admin/users',
    icon: Users,
    description: 'ユーザーアカウント・権限管理'
  },
  {
    name: 'システム設定',
    href: '/admin/settings',
    icon: Settings,
    description: 'サイト全般の設定'
  },
  {
    name: 'テンプレート管理',
    href: '/admin/templates',
    icon: MessageSquare,
    description: '審査用テンプレートの管理'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, userData, isAdmin, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 管理者権限チェック
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">アクセス権限がありません</h1>
          <p className="text-gray-600 mb-6">
            このページにアクセスするには管理者権限が必要です。
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ダッシュボードに戻る
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isCurrentPath = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用サイドバーオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* サイドバー（PCでも固定し、コンテンツは左に余白を確保） */}
      <div className={`fixed top-16 lg:top-20 bottom-0 left-0 z-60 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* サイドバーヘッダー */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-lg font-semibold text-gray-900">管理者画面</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 管理者情報 */}
        <div className="p-4 border-b border-gray-200 bg-amber-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900 truncate">
                {userData?.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-amber-700">管理者</p>
            </div>
          </div>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {adminMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = isCurrentPath(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* サイドバーフッター */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-4 h-4 text-gray-400" />
            <span>ダッシュボードに戻る</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="md:ml-64">
        {/* モバイル用ヘッダー */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">管理者画面</h1>
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        {/* ページコンテンツ */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
