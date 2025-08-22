'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { SUBSCRIPTION_PLANS, formatPrice, PLAN_COMPARISON_FEATURES } from '@/data/subscriptions'
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Shield, 
  Zap, 
  Brain, 
  Smartphone, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionPage() {
  const { user, userData, loading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<'free_web' | 'premium'>('premium')
  const [isAnnual, setIsAnnual] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  const currentPlan = userData.subscription.plan
  const premiumPlan = SUBSCRIPTION_PLANS.premium
  const freePlan = SUBSCRIPTION_PLANS.free_web

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            学習効果を最大化する
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              プレミアムプラン
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AIサービス全機能とモバイルアプリで、あなたの学習をパワーアップ
          </p>
        </motion.div>

        {/* Current Status */}
        {currentPlan === 'free_web' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">現在フリープランをご利用中</h3>
                <p className="text-blue-700">プレミアムプランで学習の可能性を広げましょう</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-2xl shadow-lg border-2 p-8 ${
              currentPlan === 'free_web' ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{freePlan.name}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formatPrice(freePlan.price)}
              </div>
              <p className="text-gray-600">{freePlan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {freePlan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {freePlan.restrictions && (
              <ul className="space-y-3 mb-8">
                {freePlan.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-gray-500 text-sm">{restriction}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentPlan === 'free_web' ? (
              <div className="bg-blue-50 text-blue-700 py-3 px-4 rounded-lg text-center font-medium">
                現在のプラン
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
              >
                ダウングレード不可
              </button>
            )}
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white rounded-2xl shadow-xl border-2 p-8 relative ${
              currentPlan === 'premium' ? 'border-purple-500' : 'border-purple-200'
            }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>おすすめ</span>
              </div>
            </div>

            <div className="text-center mb-6 mt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{premiumPlan.name}</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {formatPrice(premiumPlan.price)}
                <span className="text-lg text-gray-600">/月</span>
              </div>
              <p className="text-gray-600">{premiumPlan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {premiumPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === 'premium' ? (
              <div className="bg-purple-50 text-purple-700 py-3 px-4 rounded-lg text-center font-medium">
                現在のプラン
              </div>
            ) : (
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>プレミアムプランを開始</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">プラン比較</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-4">機能</th>
                  <th className="text-center py-4 px-4">フリープラン</th>
                  <th className="text-center py-4 px-4">プレミアムプラン</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON_FEATURES.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 pr-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof item.free_web === 'boolean' ? (
                        item.free_web ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{item.free_web}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof item.premium === 'boolean' ? (
                        item.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{item.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">プレミアムプランの特別な価値</h2>
            <p className="text-blue-100">月額4,980円で得られる学習体験の向上</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI機能フル活用</h3>
              <p className="text-blue-100">制限なしでAIサービスを利用し、学習効率を最大化</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">モバイルアプリ対応</h3>
              <p className="text-blue-100">いつでもどこでも学習を継続できる環境を提供</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">専用サポート</h3>
              <p className="text-blue-100">専門的な進路相談と個別サポートを受けられます</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">よくある質問</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">いつでもプランを変更できますか？</h3>
              <p className="text-gray-600">はい、プレミアムプランはいつでもキャンセルできます。次回請求日前にキャンセルすれば、その日まで全機能を利用できます。</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">支払い方法は何が利用できますか？</h3>
              <p className="text-gray-600">クレジットカード（Visa、MasterCard、JCB、American Express）をご利用いただけます。安全なStripe決済システムを使用しています。</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">モバイルアプリはいつ利用できますか？</h3>
              <p className="text-gray-600">プレミアムプランにアップグレード後、すぐにモバイルアプリ（iOS/Android）をダウンロードしてご利用いただけます。</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}