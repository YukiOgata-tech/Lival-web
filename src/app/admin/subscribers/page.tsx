'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Crown,
  CreditCard,
  Calendar,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit as firestoreLimit, onSnapshot, Timestamp } from 'firebase/firestore'

type Subscriber = {
  id: string
  email: string
  displayName: string
  subscription: {
    plan: 'basic' | 'premium'
    status: 'active' | 'canceled' | 'past_due' | 'trial'
    currentPeriodStart: string
    currentPeriodEnd: string
    cancelAt: string | null
    stripeCustomerId: string
    stripeSubscriptionId: string
  }
  createdAt: string
  webProfile: {
    lastWebLogin: string
  }
}

type PaginationInfo = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export default function AdminSubscribersPage() {
  const { user, userData, loading, isAdmin } = useAuth()
  const router = useRouter()

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  })
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)

  // フィルター
  const [planFilter, setPlanFilter] = useState<'all' | 'basic' | 'premium'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'canceled' | 'past_due' | 'trial'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 管理者でない場合は404
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/404')
    }
  }, [loading, isAdmin, router])

  // リアルタイム監視
  useEffect(() => {
    if (!isAdmin || loading) return

    setLoadingData(true)
    setError(null)

    // Firestoreクエリの構築
    let q = query(collection(db, 'users'))

    // プランフィルター
    if (planFilter !== 'all') {
      q = query(q, where('subscription.plan', '==', planFilter))
    } else {
      // 有料プランのみ（basic or premium）
      q = query(q, where('subscription.plan', 'in', ['basic', 'premium']))
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      q = query(q, where('subscription.status', '==', statusFilter))
    }

    // ソート
    q = query(q, orderBy('createdAt', 'desc'))

    // リミット
    q = query(q, firestoreLimit(pagination.limit))

    console.log('🔄 Setting up Firestore realtime listener...')

    // リアルタイムリスナーを設定
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`✅ Received ${snapshot.docs.length} subscribers (realtime update)`)

        const subscriberData = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            email: data.email,
            displayName: data.displayName,
            subscription: {
              plan: data.subscription?.plan,
              status: data.subscription?.status,
              currentPeriodStart: data.subscription?.currentPeriodStart?.toDate().toISOString(),
              currentPeriodEnd: data.subscription?.currentPeriodEnd?.toDate().toISOString(),
              cancelAt: data.subscription?.cancelAt?.toDate().toISOString() || null,
              stripeCustomerId: data.subscription?.stripeCustomerId,
              stripeSubscriptionId: data.subscription?.stripeSubscriptionId,
            },
            createdAt: data.createdAt?.toDate().toISOString(),
            webProfile: {
              lastWebLogin: data.webProfile?.lastWebLogin?.toDate().toISOString(),
            }
          }
        })

        setSubscribers(subscriberData)
        setPagination(prev => ({
          ...prev,
          total: subscriberData.length,
          hasMore: subscriberData.length === pagination.limit
        }))
        setLastUpdateTime(new Date())
        setLoadingData(false)
      },
      (err) => {
        console.error('❌ Firestore listener error:', err)
        setError('データの取得に失敗しました: ' + err.message)
        setLoadingData(false)
      }
    )

    // クリーンアップ: リスナーを解除
    return () => {
      console.log('🧹 Cleaning up Firestore listener')
      unsubscribe()
    }
  }, [isAdmin, loading, planFilter, statusFilter, pagination.limit])

  const handleRefresh = () => {
    // リアルタイム監視なので、リスナーが自動的に最新データを取得
    setLastUpdateTime(new Date())
    console.log('🔄 Realtime listener is always up-to-date!')
  }

  // 検索フィルタリング
  const filteredSubscribers = subscribers.filter(subscriber => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    const displayName = subscriber.displayName?.toLowerCase() || ''
    const email = subscriber.email?.toLowerCase() || ''

    return displayName.includes(query) || email.includes(query)
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: any }> = {
      'active': { label: 'アクティブ', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'canceled': { label: 'キャンセル済み', className: 'bg-red-100 text-red-800', icon: XCircle },
      'past_due': { label: '支払い遅延', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'trial': { label: 'トライアル中', className: 'bg-blue-100 text-blue-800', icon: Clock }
    }
    const badge = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      'basic': { label: 'ベーシック', className: 'bg-blue-100 text-blue-800' },
      'premium': { label: 'プレミアム', className: 'bg-purple-100 text-purple-800' }
    }
    const badge = badges[plan] || { label: plan, className: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        <Crown className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  // ローディング中
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

  // 管理者でない場合はここで弾く（useEffectで404にリダイレクトされる前）
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            ダッシュボードに戻る
          </Link>

          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                サブスクリプション契約者一覧
              </h1>
              <p className="text-gray-600 mt-2 flex items-center space-x-2">
                <span>{subscribers.length}件の契約者を表示中</span>
                {!loadingData && (
                  <>
                    <span className="text-green-600">•</span>
                    <span className="text-green-600 text-sm">リアルタイム監視</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loadingData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              <span>更新</span>
            </button>
          </div>
        </div>

        {/* フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">フィルター・検索</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">名前・メール検索</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前またはメールアドレスで検索"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">プラン</label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="all">すべて</option>
                <option value="basic">ベーシック</option>
                <option value="premium">プレミアム</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="all">すべて</option>
                <option value="active">アクティブ</option>
                <option value="trial">トライアル中</option>
                <option value="past_due">支払い遅延</option>
                <option value="canceled">キャンセル済み</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600">
              <Filter className="w-4 h-4" />
              <span>検索結果: {filteredSubscribers.length}件</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-500 hover:text-gray-700 underline ml-2"
              >
                クリア
              </button>
            </div>
          )}
        </motion.div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* 契約者リスト */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {loadingData ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? '検索条件に一致する契約者が見つかりませんでした' : '契約者が見つかりませんでした'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  検索をクリアして全て表示
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        プラン
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        契約期間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stripe
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {subscriber.displayName?.charAt(0) || subscriber.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                <User className="w-3 h-3 mr-1 text-gray-400" />
                                {subscriber.displayName || '名前未設定'}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                {subscriber.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPlanBadge(subscriber.subscription.plan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {getStatusBadge(subscriber.subscription.status)}
                            {subscriber.subscription.cancelAt && (
                              <div className="text-xs text-orange-600">
                                {formatDate(subscriber.subscription.cancelAt)}終了予定
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {formatDate(subscriber.subscription.currentPeriodStart)}
                          </div>
                          <div className="text-sm text-gray-500">
                            〜 {formatDate(subscriber.subscription.currentPeriodEnd)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500 font-mono">
                            <div className="flex items-center mb-1">
                              <CreditCard className="w-3 h-3 mr-1" />
                              {subscriber.subscription.stripeCustomerId}
                            </div>
                            <div className="text-xs text-gray-400">
                              {subscriber.subscription.stripeSubscriptionId}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* リアルタイム監視表示 */}
              <div className="bg-green-50 px-6 py-4 border-t border-green-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">リアルタイム監視中</span>
                  <span className="text-sm text-green-600">
                    {searchQuery
                      ? `${filteredSubscribers.length}件の検索結果（全${subscribers.length}件中）`
                      : `${subscribers.length}件表示中`}
                    （変更は自動反映されます）
                  </span>
                </div>
                {lastUpdateTime && (
                  <div className="text-xs text-green-600">
                    最終更新: {lastUpdateTime.toLocaleTimeString('ja-JP')}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* 注意事項 */}
        <div className="mt-4 text-center text-sm text-gray-500">
          💡 このページはFirestoreのリアルタイム監視を使用しています。契約者データの変更は自動的に反映されます。
        </div>
      </div>
    </div>
  )
}
