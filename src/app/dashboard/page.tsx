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
  Calendar,
  ArrowRight,
  Crown,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, userData, loading } = useAuth()

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                おかえりなさい、{userData.displayName}さん！
              </h1>
              <p className="text-gray-600 mt-2">今日も一緒に学習を進めましょう</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
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
            className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Crown className="w-8 h-8 text-yellow-300" />
                <div>
                  <h3 className="text-lg font-semibold">プレミアムプランで学習効果を最大化</h3>
                  <p className="text-blue-100">AIサービス全機能とモバイルアプリが利用可能になります</p>
                </div>
              </div>
              <Link
                href="/subscription"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <span>アップグレード</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">現在のレベル</p>
                <p className="text-2xl font-bold text-gray-900">{userData.level}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">経験値</p>
                <p className="text-2xl font-bold text-gray-900">{userData.xp}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">獲得コイン</p>
                <p className="text-2xl font-bold text-gray-900">{userData.coins}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">学習セッション</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userData.individualSessionCount + userData.groupSessionCount}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">クイックアクション</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/chat"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AIチャット</h3>
                      <p className="text-sm text-gray-600">AIとチャットして学習</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/diagnosis"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">学習タイプ診断</h3>
                      <p className="text-sm text-gray-600">あなたに最適な学習方法を発見</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/study"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">学習開始</h3>
                      <p className="text-sm text-gray-600">今日の学習プランを実行</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/group"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">グループ学習</h3>
                      <p className="text-sm text-gray-600">仲間と一緒に学習</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">現在のプラン</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">プラン</span>
                  <span className="font-medium text-gray-900">{planInfo?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">料金</span>
                  <span className="font-medium text-gray-900">{formatPrice(planInfo?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">状態</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userData.subscription.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                </div>
              </div>
              
              <Link
                href="/account"
                className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
              >
                アカウント管理
              </Link>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">アカウントを作成しました</p>
                    <p className="text-xs text-gray-500">
                      {userData.createdAt.toDate().toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Web版ログイン</p>
                    <p className="text-xs text-gray-500">
                      {userData.webProfile.lastWebLogin.toDate().toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}