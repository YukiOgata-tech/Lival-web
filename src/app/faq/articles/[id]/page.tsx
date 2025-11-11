// src/app/faq/articles/[id]/page.tsx
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Clock, 
  Tag,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronRight,
  Info,
  AlertTriangle,
  Code
} from 'lucide-react'

// 型とデータのインポート
import { 
  findArticleById, 
  getRelatedArticles, 
  generateTableOfContents,
  type FAQArticle,
  type FAQContent,
  type TableOfContents
} from '@/data/faq'

interface Props {
  params: Promise<{ id: string }>
}

export default function FAQArticlePage({ params }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [article, setArticle] = useState<FAQArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<FAQArticle[]>([])
  const [tableOfContents, setTableOfContents] = useState<TableOfContents[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params
        setResolvedParams(resolved)
        
        const foundArticle = findArticleById(resolved.id)
        if (!foundArticle) {
          notFound()
          return
        }

        setArticle(foundArticle)
        setRelatedArticles(getRelatedArticles(resolved.id))
        setTableOfContents(generateTableOfContents(foundArticle))
        setLoading(false)
      } catch (error) {
        console.error('Error loading article:', error)
        setLoading(false)
      }
    }

    resolveParams()
  }, [params])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      console.log('Share/copy failed:', error)
    }
  }

  const renderContent = (content: FAQContent, index: number) => {
    const baseClasses = "mb-4 sm:mb-5"
    
    switch (content.type) {
      case 'heading':
        const headingLevel = content.level || 2
        const headingStyles: Record<number, string> = {
          1: "text-2xl sm:text-3xl font-bold text-gray-900 mb-6 mt-10",
          2: "text-xl sm:text-2xl font-bold text-gray-900 mb-5 mt-8",
          3: "text-lg sm:text-xl font-semibold text-gray-800 mb-4 mt-6",
          4: "text-base sm:text-lg font-semibold text-gray-800 mb-3 mt-5",
          5: "text-sm sm:text-base font-semibold text-gray-700 mb-2 mt-4",
          6: "text-xs sm:text-sm font-semibold text-gray-700 mb-2 mt-3"
        }
        
        const className = headingStyles[headingLevel]
        const id = `heading-${index}`
        
        // レベルに応じて適切なヘッダータグを返す
        switch (headingLevel) {
          case 1:
            return <h1 key={index} id={id} className={className}>{content.content}</h1>
          case 2:
            return <h2 key={index} id={id} className={className}>{content.content}</h2>
          case 3:
            return <h3 key={index} id={id} className={className}>{content.content}</h3>
          case 4:
            return <h4 key={index} id={id} className={className}>{content.content}</h4>
          case 5:
            return <h5 key={index} id={id} className={className}>{content.content}</h5>
          case 6:
            return <h6 key={index} id={id} className={className}>{content.content}</h6>
          default:
            return <h2 key={index} id={id} className={className}>{content.content}</h2>
        }

      case 'paragraph':
        return (
          <p key={index} className={`${baseClasses} text-gray-700 text-sm sm:text-base leading-relaxed`}>
            <span dangerouslySetInnerHTML={{ __html: content.content }} />
          </p>
        )

      case 'list':
        return (
          <ul key={index} className={`${baseClasses} space-y-1.5 ml-5 sm:ml-6`}>
            {content.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 text-sm sm:text-base flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2.5 flex-shrink-0"></span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )

      case 'steps':
        return (
          <ol key={index} className={`${baseClasses} space-y-2`}>
            {content.items?.map((step, stepIndex) => (
              <li key={stepIndex} className="flex items-start">
                <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3 mt-0.5">
                  {stepIndex + 1}
                </div>
                <span className="text-gray-700 text-sm sm:text-base pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        )

      case 'info':
        return (
          <div key={index} className={`${baseClasses} bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4`}>
            <div className="flex items-start">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 text-sm sm:text-base">{content.content}</p>
            </div>
          </div>
        )

      case 'warning':
        return (
          <div key={index} className={`${baseClasses} bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4`}>
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm sm:text-base">{content.content}</p>
            </div>
          </div>
        )

      case 'code':
        return (
          <div key={index} className={`${baseClasses} bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Code className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                <span className="text-xs text-gray-400">{content.language || 'text'}</span>
              </div>
            </div>
            <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap">
              <code>{content.content}</code>
            </pre>
          </div>
        )

      default:
        return <div key={index}></div>
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">記事を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href="/faq"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              FAQに戻る
            </Link>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleBookmark}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
            
            {/* メインコンテンツ */}
            <div className="md:col-span-8">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* 記事ヘッダー */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-1.5 mb-3">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    {article.isPopular && (
                      <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        人気
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {article.title}
                  </h1>
                  
                  <p className="text-base text-gray-600 mb-4">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      約{article.estimatedReadTime}分
                    </div>
                    <div className="text-gray-400">
                      更新日: {article.lastUpdated}
                    </div>
                  </div>
                  
                  {/* タグ */}
                  <div className="flex items-center space-x-1.5 mt-3">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 記事本文 */}
                <div className="p-5 sm:p-6">
                  <div className="prose max-w-none">
                    {article.content.map((content, index) => 
                      renderContent(content, index)
                    )}
                  </div>
                </div>

                {/* フィードバック */}
                <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                      この記事は役に立ちましたか？
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleFeedback('helpful')}
                        className={`flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          feedback === 'helpful'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1.5" />
                        はい
                      </button>
                      
                      <button
                        onClick={() => handleFeedback('not-helpful')}
                        className={`flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          feedback === 'not-helpful'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1.5" />
                        いいえ
                      </button>
                    </div>
                    
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <p className="text-blue-800 text-sm">
                          {feedback === 'helpful' 
                            ? 'ありがとうございます！引き続きサポートさせていただきます。'
                            : 'フィードバックをありがとうございます。改善に努めます。'
                          }
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.article>
            </div>

            {/* サイドバー */}
            <div className="md:col-span-4 mt-6 md:mt-0">
              {/* 目次 */}
              {tableOfContents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6 lg:sticky lg:top-24"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    目次
                  </h3>
                  <nav className="space-y-1.5">
                    {tableOfContents.map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors hover:text-blue-600 ${
                          item.level === 1 ? 'font-semibold text-gray-900' :
                          item.level === 2 ? 'text-gray-700 pl-2' :
                          'text-gray-600 pl-4'
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}

              {/* 関連記事 */}
              {relatedArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    関連記事
                  </h3>
                  <div className="space-y-3">
                    {relatedArticles.map((relatedArticle, index) => (
                      <Link
                        key={index}
                        href={`/faq/articles/${relatedArticle.id}`}
                        className="block group"
                      >
                        <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5 text-sm">
                                {relatedArticle.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {relatedArticle.description}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 inline-block">
                                {relatedArticle.category}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* お問い合わせCTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  まだ解決しませんか？
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  カスタマーサポートチームがお手伝いします
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  お問い合わせ
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}