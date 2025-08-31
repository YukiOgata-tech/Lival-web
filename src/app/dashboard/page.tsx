'use client'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice, getPlanInfo } from '@/data/subscriptions'
import { 
  Brain, 
  Trophy, 
  Zap, 
  Coins, 
  BookOpen, 
  Users, 
  ArrowRight,
  Crown,
  Star,
  PenTool,
  Shield,
  Megaphone
} from 'lucide-react'
import Link from 'next/link'
import StudySummaryCard from '@/components/study/StudySummaryCard'

export default function DashboardPage() {
  const { user, userData, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ユーザー情報を読み込み中...</p>
          <p className="text-sm text-gray-500 mt-2">
            しばらく待ってもアクセスできない場合は、
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 underline ml-1"
            >
              ページを再読み込み
            </button>
            してください
          </p>
        </div>
      </div>
    )
  }

  const planInfo = getPlanInfo(userData.subscription.plan)
  const isFreePlan = userData.subscription.plan === 'free_web'

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                おかえりなさい、{userData.displayName}さん！
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">今日も一緒に学習を進めましょう</p>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upgrade Banner for Free Plan */}
        {isFreePlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 mt-0.5 sm:mt-0 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold leading-tight">プレミアムプランで学習効果を最大化</h3>
                  <p className="text-blue-100 mt-1 text-sm sm:text-base">AIサービス全機能とモバイルアプリが利用可能になります</p>
                </div>
              </div>
              <Link
                href="/subscription"
                className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base flex-shrink-0"
              >
                <span>アップグレード</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">現在のレベル</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{userData.level}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">経験値</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{userData.xp}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">獲得コイン</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{userData.coins}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">学習セッション</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {userData.individualSessionCount + userData.groupSessionCount}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">クイックアクション</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href="/chat"
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">AIチャット</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">AIとチャットして学習</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/diagnosis"
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">学習タイプ診断</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">最適な学習方法を発見</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/study"
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">学習開始</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">今日の学習プランを実行</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/group"
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">グループ学習</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">仲間と一緒に学習</p>
                    </div>
                  </div>
                </Link>

                {/* Blog posting for premium users */}
                {!isFreePlan && (
                  <Link
                    href="/submit"
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group sm:col-span-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                        <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">記事投稿</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">ブログ記事を書いて共有</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Study Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StudySummaryCard userId={user.uid} />
            </motion.div>

            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">現在のプラン</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">プラン</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{planInfo?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">料金</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{formatPrice(planInfo?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">状態</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userData.subscription.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                </div>
              </div>
              
              <Link
                href="/account"
                className="mt-3 sm:mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block text-sm sm:text-base"
              >
                アカウント管理
              </Link>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">最近のアクティビティ</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900">アカウントを作成しました</p>
                    <p className="text-xs text-gray-500">
                      {userData.createdAt.toDate().toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900">Web版ログイン</p>
                    <p className="text-xs text-gray-500">
                      {userData.webProfile.lastWebLogin.toDate().toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 管理者セクション */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl shadow-sm border border-orange-200 p-4 sm:p-6"
              >
                <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">管理者メニュー</h3>
                    <p className="text-xs sm:text-sm text-gray-600">システム管理機能</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">管理ダッシュボード</p>
                      <p className="text-xs text-gray-600 truncate">システム統計・管理</p>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                  </Link>

                  <Link
                    href="/admin/news"
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                      <Megaphone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">お知らせ管理</p>
                      <p className="text-xs text-gray-600 truncate">お知らせの作成・編集</p>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                  </Link>

                  <Link
                    href="/admin/review"
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                      <PenTool className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">記事審査</p>
                      <p className="text-xs text-gray-600 truncate">ブログ記事の審査・管理</p>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                  </Link>

                  <Link
                    href="/admin/users"
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">ユーザー管理</p>
                      <p className="text-xs text-gray-600 truncate">アカウント・権限管理</p>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                  </Link>
                </div>

                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-amber-800">
                      管理者権限でログイン中
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    システムの重要な機能にアクセスできます
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}