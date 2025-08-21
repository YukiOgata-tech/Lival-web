'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Users, 
  Zap,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const cookieCategories = [
  {
    id: 'essential',
    name: '必須Cookie',
    icon: Shield,
    description: 'サービスの基本機能を提供するために必要不可欠なCookie',
    required: true,
    color: 'from-green-500 to-emerald-600',
    cookies: [
      {
        name: '__Secure-next-auth.session-token',
        purpose: 'ユーザーログイン状態の維持',
        duration: '30日間',
        provider: 'Next.js Auth'
      },
      {
        name: '__Secure-next-auth.csrf-token',
        purpose: 'CSRF攻撃からの保護',
        duration: 'セッション中',
        provider: 'Next.js Auth'
      },
      {
        name: 'firebase-auth-user',
        purpose: 'Firebase認証状態の管理',
        duration: '永続（手動削除まで）',
        provider: 'Firebase'
      },
      {
        name: 'preference-settings',
        purpose: 'ユーザー設定（言語、テーマ等）の保存',
        duration: '1年間',
        provider: 'LIVAL AI'
      }
    ]
  },
  {
    id: 'analytics',
    name: '分析Cookie',
    icon: BarChart3,
    description: 'サービス改善のためのアクセス解析・利用状況分析',
    required: false,
    color: 'from-blue-500 to-indigo-600',
    cookies: [
      {
        name: '_ga',
        purpose: 'ユニークユーザーの識別',
        duration: '2年間',
        provider: 'Google Analytics'
      },
      {
        name: '_ga_XXXXXXXXXX',
        purpose: 'セッション識別とページビュー計測',
        duration: '2年間',
        provider: 'Google Analytics'
      },
      {
        name: '__vercel_live_token',
        purpose: 'Vercel Analyticsによるパフォーマンス分析',
        duration: '1年間',
        provider: 'Vercel'
      },
      {
        name: 'lival_usage_tracking',
        purpose: '学習機能の利用状況分析',
        duration: '6ヶ月間',
        provider: 'LIVAL AI'
      }
    ]
  },
  {
    id: 'functional',
    name: '機能Cookie',
    icon: Zap,
    description: 'パーソナライズされた体験と拡張機能の提供',
    required: false,
    color: 'from-purple-500 to-violet-600',
    cookies: [
      {
        name: 'student_type_preference',
        purpose: '診断結果に基づくパーソナライズ設定',
        duration: '1年間',
        provider: 'LIVAL AI'
      },
      {
        name: 'ai_coach_settings',
        purpose: 'AIコーチングの個人設定',
        duration: '6ヶ月間',
        provider: 'LIVAL AI'
      },
      {
        name: 'study_progress_cache',
        purpose: '学習進捗の一時保存',
        duration: '30日間',
        provider: 'LIVAL AI'
      },
      {
        name: 'notification_preferences',
        purpose: '通知設定の保存',
        duration: '1年間',
        provider: 'LIVAL AI'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'マーケティングCookie',
    icon: Users,
    description: '関連性の高い広告表示とマーケティング効果測定',
    required: false,
    color: 'from-orange-500 to-red-600',
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook広告の効果測定',
        duration: '3ヶ月間',
        provider: 'Meta (Facebook)'
      },
      {
        name: '__utm_params',
        purpose: '流入元の追跡（マーケティング効果測定）',
        duration: '6ヶ月間',
        provider: 'LIVAL AI'
      },
      {
        name: 'referral_source',
        purpose: '紹介経路の記録',
        duration: '30日間',
        provider: 'LIVAL AI'
      }
    ]
  }
]

export default function CookiesPolicyPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['essential'])
  const [cookiePreferences, setCookiePreferences] = useState<{[key: string]: boolean}>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleCookiePreference = (categoryId: string) => {
    if (categoryId === 'essential') return // 必須Cookieは変更不可
    
    setCookiePreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const savePreferences = () => {
    // 実際の実装では、Cookieに設定を保存
    console.log('Cookie preferences saved:', cookiePreferences)
    alert('設定を保存しました')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Cookie className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Cookieポリシー
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              LIVAL AIでのCookieの使用について
            </p>
            <div className="mt-6 text-sm text-orange-200">
              最終更新日：2024年12月21日 | 施行日：2024年4月1日
            </div>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 bg-orange-50 rounded-2xl p-8 border border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-orange-500" />
              Cookieとは
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookieとは、ウェブサイトがユーザーのブラウザに保存する小さなテキストファイルです。
              LIVAL AIでは、サービスの提供、改善、パーソナライズのためにCookieを使用しています。
            </p>
            <p className="text-gray-700 leading-relaxed">
              このページでは、当社が使用するCookieの種類と目的、管理方法について説明します。
              また、ページ下部でCookieの設定を変更することができます。
            </p>
          </motion.div>

          {/* Cookie Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-blue-500" />
                Cookie設定
              </h2>
              <button
                onClick={savePreferences}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                設定を保存
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              以下の設定で、Cookieの使用を管理できます。必須Cookie以外は無効にすることが可能です。
            </p>
            
            {/* Quick Toggle Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cookieCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <category.icon className="w-5 h-5 text-gray-600" />
                    <button
                      onClick={() => toggleCookiePreference(category.id)}
                      disabled={category.required}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        cookiePreferences[category.id] 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      } ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        cookiePreferences[category.id] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {category.cookies.length}個のCookie
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {cookieCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mr-4`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          {category.name}
                          {category.required && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              必須
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCookiePreference(category.id)
                        }}
                        disabled={category.required}
                        className="flex items-center space-x-2"
                      >
                        {cookiePreferences[category.id] ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {cookiePreferences[category.id] ? '有効' : '無効'}
                        </span>
                      </button>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Cookie Details */}
                {expandedCategories.includes(category.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 border-t border-gray-100"
                  >
                    <div className="pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        使用するCookie一覧
                      </h4>
                      <div className="space-y-4">
                        {category.cookies.map((cookie, cookieIndex) => (
                          <div key={cookieIndex} className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-1">Cookie名</h5>
                                <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                                  {cookie.name}
                                </code>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-1">目的</h5>
                                <p className="text-sm text-gray-700">{cookie.purpose}</p>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-1">保存期間</h5>
                                <p className="text-sm text-gray-700">{cookie.duration}</p>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-1">提供者</h5>
                                <p className="text-sm text-gray-700">{cookie.provider}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Browser Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-gray-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ブラウザでのCookie管理
            </h3>
            <p className="text-gray-700 mb-6">
              ほとんどのブラウザでは、Cookieの受け入れを制御したり、既存のCookieを削除したりできます。
              以下のリンクから、主要ブラウザでのCookie設定方法をご確認いただけます。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                { name: 'Firefox', url: 'https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop' },
                { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/' },
                { name: 'Edge', url: 'https://support.microsoft.com/help/4027947/microsoft-edge-delete-cookies' }
              ].map((browser, index) => (
                <a
                  key={index}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                >
                  <span className="font-medium text-gray-900">{browser.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> 必須Cookie以外を無効にすると、一部の機能が制限される場合があります。
                特に、パーソナライズされたAIコーチング機能や学習進捗の保存に影響が出る可能性があります。
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cookieについてのご質問
            </h3>
            <p className="text-gray-700 mb-6">
              Cookieポリシーについてご不明な点がございましたら、
              お気軽にお問い合わせください。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                お問い合わせ
              </Link>
              
              <Link
                href="/privacy"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                プライバシーポリシー
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}