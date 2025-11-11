'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
  Star,
  ChevronDown
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
        preview: '家庭教師AI（写真でも質問OK）/ 進路カウンセラーAI（モバイル限定）/ 学習プランナーAIの違い',
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
  },
  {
    id: 'ai-types',
    title: '3つのAIエージェントの違い',
    category: 'AIコーチング',
  },
  {
    id: 'pricing-plans',
    title: '料金プランの詳細',
    category: '料金・サブスクリプション',
  },
  {
    id: 'login-issues',
    title: 'ログインできない場合',
    category: '技術的な問題',
  },
  {
    id: 'personality-test',
    title: '性格診断の受け方',
    category: 'はじめに',
  },
  {
    id: 'blog-about',
    title: 'ブログの仕組みと価値',
    category: '教育ブログ',
  }
]

function CategoryCard({ category, index }: { category: typeof faqCategories[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Category Header */}
      <div 
        className={`bg-gradient-to-r ${category.color} p-5 text-white cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <category.icon className="w-7 h-7 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold">{category.title}</h3>
              <p className="text-sm text-white/80">{category.description}</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Articles List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white"
          >
            <div className="p-4 sm:p-5">
              <div className="space-y-2">
                {category.articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/faq/articles/${article.id}`}
                    className="block group"
                  >
                    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h4>
                          {article.isPopular && (
                            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                              人気
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {article.preview}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              よくあるご質問
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto mb-6">
              LIVAL AIに関するよくあるご質問と回答を掲載しています
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg placeholder:text-gray-400"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* お知らせ */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5"
            >
              <h3 className="text-base font-bold text-emerald-800 mb-2">最近のアップデート</h3>
              <ul className="text-sm text-emerald-900 space-y-1 list-disc pl-5">
                <li>家庭教師AIで「写真からの質問」に対応しました。</li>
                <li>進路カウンセラーAIは<strong>モバイルアプリ限定</strong>でご利用いただけます。</li>
                <li>AIで解決しづらい内容は、会員限定のLINEオープンチャットでフォロー予定です。</li>
              </ul>
            </motion.div>
          )}

          {/* Popular Articles */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">人気の記事</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {popularArticles.slice(0, 6).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/faq/articles/${article.id}`}
                      className="block bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full"
                    >
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-500">{article.category}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <div className="flex justify-end">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {searchQuery ? `"${searchQuery}" の検索結果` : 'カテゴリ別よくある質問'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {(searchQuery ? filteredCategories : faqCategories).map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </motion.div>

          {/* No Results */}
          {searchQuery && filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8 text-center border border-purple-100"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              まずは学習タイプ診断から始めませんか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              わずか5-8分の診断で、あなたに最適化されたAIコーチング体験を開始できます。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/diagnosis"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full transition-all duration-300"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                無料診断を始める
              </Link>
              
              <Link
                href="/diagnosis/types"
                className="inline-flex items-center justify-center px-6 py-3 border border-purple-300 text-purple-700 font-semibold rounded-full hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              >
                6つのタイプを見る
              </Link>
            </div>
          </motion.div>

          {/* Blog CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 text-center border border-indigo-100"
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              教育の専門知識をもっと深く
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Lival AIブログでは、教育・学習の専門家が厳選した高品質なコンテンツを提供しています。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-full transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                ブログを読む
              </Link>
              
              <Link
                href="/blog/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 text-indigo-700 font-semibold rounded-full hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
              >
                ブログについて
              </Link>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 text-center border border-blue-100"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              解決しない問題がありますか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              FAQで解決しない場合は、カスタマーサポートまでお気軽にお問い合わせください。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                お問い合わせ
              </Link>
              
              <Link
                href="mailto:info@lival-ai.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
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
