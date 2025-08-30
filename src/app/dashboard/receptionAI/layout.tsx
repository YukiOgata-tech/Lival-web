'use client'

import { useRouter } from 'next/navigation'
import { Home, LayoutDashboard, RefreshCcw, CreditCard, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function ReceptionAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, userData } = useAuth()

  const handleRefresh = () => {
    window.location.reload()
  }

  const navigationItems = [
    {
      icon: Home,
      label: 'ホーム',
      onClick: () => router.push('/'),
      variant: 'ghost' as const
    },
    {
      icon: LayoutDashboard,
      label: 'ダッシュボード',
      onClick: () => router.push('/dashboard'),
      variant: 'ghost' as const
    },
    {
      icon: RefreshCcw,
      label: 'リフレッシュ',
      onClick: handleRefresh,
      variant: 'ghost' as const
    },
    {
      icon: CreditCard,
      label: 'サブスクリプション',
      onClick: () => router.push('/subscription'),
      variant: 'outline' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* カスタムヘッダー */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 左側: 戻るボタン */}
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
              <span className="hidden sm:inline">戻る</span>
            </button>

            {/* 中央: ページタイトル */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold">
                受付AI・プロフィール設定
              </h1>
            </div>

            {/* 右側: ナビゲーションボタン */}
            <div className="flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${item.variant === 'outline' 
                      ? 'border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }
                    ${index === 0 ? 'hidden sm:flex' : 'flex'}
                  `}
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ユーザー情報バー（デスクトップのみ） */}
          {user && (
            <div className="hidden lg:flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-300">ようこそ、</span>
                  <span className="text-white font-medium">
                    {user.displayName || 'ゲスト'}さん
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>プロフィール設定中</span>
                </div>
                {userData?.subscription && (
                  <div className="px-2 py-1 bg-gray-700 rounded text-xs">
                    {userData.subscription.plan === 'premium' ? 'プレミアム' : 'フリープラン'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative">
        {children}
      </main>
    </div>
  )
}