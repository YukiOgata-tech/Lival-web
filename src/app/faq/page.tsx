'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { 
  Search, 
  HelpCircle, 
  User, 
  CreditCard, 
  Settings, 
  Shield, 
  BookOpen,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Eye,
  Star
} from 'lucide-react'

const faqCategories = [
  {
    id: 'getting-started',
    title: 'はじめに',
    description: 'アカウント作成から初期設定まで',
    icon: User,
    color: 'from-blue-500 to-indigo-600',
    articles: [
      {
        id: 'account-creation',
        title: 'アカウントの作成方法',
        preview: 'アカウントを作成する手順を詳しく説明します...',
        isPopular: true
      },
      {
        id: 'personality-test',
        title: '性格診断の受け方',
        preview: '6つの学習タイプを判定する性格診断について...',
        isPopular: true
      },
      {
        id: 'first-setup',
        title: '初期設定の方法',
        preview: 'アカウント作成後の基本設定について...',
        isPopular: false
      },
      {
        id: 'mobile-app',
        title: 'モバイルアプリの使い方',
        preview: 'スマートフォンアプリの基本操作について...',
        isPopular: false
      }
    ]
  },
  {
    id: 'ai-coaching',
    title: 'AIコーチング',
    description: 'AI機能と学習サポートについて',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-600',
    articles: [
      {
        id: 'ai-types',
        title: '3つのAIエージェントの違い',
        preview: '家庭教師AI、進路カウンセラーAI、学習計画AIの特徴...',
        isPopular: true
      },
      {
        id: 'personalization',
        title: 'パーソナライズ機能について',
        preview: '個人に最適化されたAIコーチングの仕組み...',
        isPopular: true
      },
      {
        id: 'study-plan',
        title: '学習計画の作成方法',
        preview: 'AIが作成する学習計画のカスタマイズについて...',
        isPopular: false
      },
      {
        id: 'progress-tracking',
        title: '学習進捗の確認方法',
        preview: '進捗レポートの見方と活用方法...',
        isPopular: false
      }
    ]
  },
  {
    id: 'subscription',
    title: '料金・サブスクリプション',
    description: '料金プランと支払いについて',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-600',
    articles: [
      {
        id: 'pricing-plans',
        title: '料金プランの詳細',
        preview: 'ベーシック、プレミアム、エンタープライズプランの違い...',
        isPopular: true
      },
      {
        id: 'payment-methods',
        title: '支払い方法について',
        preview: '利用可能な決済手段と支払いサイクル...',
        isPopular: true
      },
      {
        id: 'cancellation',
        title: '解約・退会の手続き',
        preview: 'サブスクリプションの解約方法と注意事項...',
        isPopular: false
      },
      {
        id: 'refund-policy',
        title: '返金・満足保証について',
        preview: '返金条件と満足保証制度の詳細...',
        isPopular: false
      }
    ]
  },
  {
    id: 'technical',
    title: '技術的な問題',
    description: 'トラブルシューティングと技術サポート',
    icon: Settings,
    color: 'from-orange-500 to-red-600',
    articles: [
      {
        id: 'login-issues',
        title: 'ログインできない場合',
        preview: 'ログイン問題の一般的な原因と解決方法...',
        isPopular: true
      },
      {
        id: 'app-crashes',
        title: 'アプリが動作しない',
        preview: 'アプリクラッシュや動作不良の対処法...',
        isPopular: false
      },
      {
        id: 'sync-problems',
        title: 'データ同期の問題',
        preview: 'デバイス間でのデータ同期トラブル...',
        isPopular: false
      },
      {
        id: 'performance',
        title: 'パフォーマンスの改善',
        preview: 'アプリの動作速度を向上させる方法...',
        isPopular: false
      }
    ]
  },
  {
    id: 'privacy',
    title: 'プライバシー・セキュリティ',
    description: 'データ保護と安全性について',
    icon: Shield,
    color: 'from-teal-500 to-cyan-600',
    articles: [
      {
        id: 'data-protection',
        title: '個人情報の保護について',
        preview: '学習データとプライバシー保護の取り組み...',
        isPopular: true
      },
      {
        id: 'parental-controls',
        title: '保護者向け機能',
        preview: '未成年者の利用における保護者の管理機能...',
        isPopular: false
      },
      {
        id: 'data-export',
        title: 'データのエクスポート',
        preview: '学習データのダウンロードと移行について...',
        isPopular: false
      },
      {
        id: 'account-security',
        title: 'アカウントセキュリティ',
        preview: '安全なパスワード設定と二段階認証...',
        isPopular: false
      }
    ]
  },
  {
    id: 'blog',
    title: '教育ブログ',
    description: '教育特化コンテンツプラットフォーム',
    icon: BookOpen,
    color: 'from-indigo-500 to-blue-600',
    articles: [
      {
        id: 'blog-about',
        title: 'ブログの仕組みと価値',
        preview: '教育に特化した専門ブログプラットフォームの特徴と品質管理システム...',
        isPopular: true
      },
      {
        id: 'blog-access-levels',
        title: 'アクセスレベルについて',
        preview: '無料記事・ティザー記事・プレミアム記事の違いとアクセス権限...',
        isPopular: true
      },
      {
        id: 'blog-quality',
        title: '記事の品質管理',
        preview: '厳格な審査システムと専門家による執筆・編集プロセス...',
        isPopular: false
      },
      {
        id: 'blog-benefits',
        title: 'ブログ読者の価値',
        preview: '学習効果向上・時間節約・専門性獲得のメリット...',
        isPopular: false
      }
    ]
  },
  {
    id: 'contact',
    title: 'お問い合わせ',
    description: 'サポートへの連絡方法',
    icon: MessageCircle,
    color: 'from-pink-500 to-rose-600',
    articles: [
      {
        id: 'contact-methods',
        title: 'お問い合わせ方法',
        preview: 'サポートチームへの連絡手段と対応時間...',
        isPopular: true
      },
      {
        id: 'response-time',
        title: '回答時間について',
        preview: 'お問い合わせの種類別回答時間の目安...',
        isPopular: false
      },
      {
        id: 'feedback',
        title: 'フィードバックの送信',
        preview: 'サービス改善のためのフィードバック方法...',
        isPopular: false
      }
    ]
  }
]

const popularArticles = [
  {
    id: 'account-creation',
    title: 'アカウントの作成方法',
    category: 'はじめに',
    views: 1250
  },
  {
    id: 'ai-types',
    title: '3つのAIエージェントの違い',
    category: 'AIコーチング',
    views: 890
  },
  {
    id: 'pricing-plans',
    title: '料金プランの詳細',
    category: '料金・サブスクリプション',
    views: 756
  },
  {
    id: 'login-issues',
    title: 'ログインできない場合',
    category: '技術的な問題',
    views: 623
  },
  {
    id: 'personality-test',
    title: '性格診断の受け方',
    category: 'はじめに',
    views: 445
  },
  {
    id: 'blog-about',
    title: 'ブログの仕組みと価値',
    category: '教育ブログ',
    views: 387
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              よくあるご質問
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 flex items-center justify-center">
              <Image
                src="/images/header-livalAI.png"
                alt="Lival AI"
                width={100}
                height={28}
                className="h-6 w-auto brightness-0 invert mr-2"
              />
              に関するよくあるご質問と回答を掲載しています
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Popular Articles */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center mb-8">
                <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">人気の記事</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularArticles.slice(0, 6).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/faq/articles/${article.id}`}
                      className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-sm text-gray-500">{article.category}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {searchQuery ? `"${searchQuery}" の検索結果` : 'カテゴリ別よくある質問'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(searchQuery ? filteredCategories : faqCategories).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                    <div className="flex items-center">
                      <category.icon className="w-8 h-8 mr-3" />
                      <div>
                        <h3 className="text-xl font-bold">{category.title}</h3>
                        <p className="text-white/80">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Articles List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {category.articles.map((article, articleIndex) => (
                        <Link
                          key={article.id}
                          href={`/faq/articles/${article.id}`}
                          className="block group"
                        >
                          <div className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {article.title}
                                </h4>
                                {article.isPopular && (
                                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                    人気
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {article.preview}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* No Results */}
          {searchQuery && filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                検索結果が見つかりませんでした
              </h3>
              <p className="text-gray-600 mb-6">
                別のキーワードで検索するか、お問い合わせください
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                お問い合わせ
              </Link>
            </motion.div>
          )}

          {/* Diagnosis CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center border border-purple-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              まずは学習タイプ診断から始めませんか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              わずか5-8分の診断で、あなたに最適化されたAIコーチング体験を開始できます。
              6つの学習タイプから、あなたの特性を科学的に分析します。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/diagnosis"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                無料診断を始める
              </Link>
              
              <Link
                href="/diagnosis/types"
                className="inline-flex items-center px-8 py-3 border border-purple-300 text-purple-700 font-semibold rounded-full hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              >
                6つのタイプを見る
              </Link>
            </div>
          </motion.div>

          {/* Blog CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 text-center border border-indigo-100"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              教育の専門知識をもっと深く学びませんか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Lival AIブログでは、教育・学習の専門家が厳選した高品質なコンテンツを提供しています。
              実践的な学習法から最新の教育研究まで、あなたの成長をサポートします。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                ブログを読む
              </Link>
              
              <Link
                href="/blog/about"
                className="inline-flex items-center px-8 py-3 border border-indigo-300 text-indigo-700 font-semibold rounded-full hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
              >
                ブログについて詳しく
              </Link>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              解決しない問題がありますか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              FAQで解決しない場合は、カスタマーサポートまでお気軽にお問い合わせください。
              平日10:00-18:00にて対応いたします。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                お問い合わせ
              </Link>
              
              <Link
                href="mailto:support@lival-ai.com"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                メールで問い合わせ
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}