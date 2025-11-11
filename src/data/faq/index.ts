// src/data/faq/index.ts
import { FAQCategory, FAQArticle, TableOfContents } from './types'
import { gettingStartedArticles } from './categories/getting-started'
import { aiCoachingArticles } from './categories/ai-coaching'
import { subscriptionArticles } from './categories/subscription'
import { technicalArticles } from './categories/technical'
import { privacyArticles } from './categories/privacy'
import { contactArticles } from './categories/contact'

// 全記事の統合
export const allFAQArticles: FAQArticle[] = [
  ...gettingStartedArticles,
  ...aiCoachingArticles,
  ...subscriptionArticles,
  ...technicalArticles,
  ...privacyArticles,
  ...contactArticles,
]

// カテゴリ別データ
export const faqCategories: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'はじめに',
    description: 'アカウント作成から初期設定まで',
    icon: 'User',
    color: 'from-blue-500 to-indigo-600',
    articles: gettingStartedArticles
  },
  {
    id: 'ai-coaching',
    title: 'AIコーチング',
    description: 'AI機能と学習サポートについて',
    icon: 'BookOpen',
    color: 'from-purple-500 to-violet-600',
    articles: aiCoachingArticles
  },
  {
    id: 'subscription',
    title: '料金・サブスクリプション',
    description: '料金プランと支払いについて',
    icon: 'CreditCard',
    color: 'from-green-500 to-emerald-600',
    articles: subscriptionArticles
  },
  {
    id: 'technical',
    title: '技術的な問題',
    description: 'トラブルシューティングと技術サポート',
    icon: 'Settings',
    color: 'from-orange-500 to-red-600',
    articles: technicalArticles
  },
  {
    id: 'privacy',
    title: 'プライバシー・セキュリティ',
    description: 'データ保護と安全性について',
    icon: 'Shield',
    color: 'from-teal-500 to-cyan-600',
    articles: privacyArticles
  },
  {
    id: 'contact',
    title: 'お問い合わせ',
    description: 'サポートへの連絡方法',
    icon: 'MessageCircle',
    color: 'from-pink-500 to-rose-600',
    articles: contactArticles
  }
]

// 記事検索関数
export const findArticleById = (id: string): FAQArticle | undefined => {
  return allFAQArticles.find(article => article.id === id)
}

// カテゴリ別記事取得
export const getArticlesByCategory = (categoryId: string): FAQArticle[] => {
  return allFAQArticles.filter(article => article.categoryId === categoryId)
}

// 人気記事取得
export const getPopularArticles = (limit: number = 5): FAQArticle[] => {
  return allFAQArticles
    .filter(article => article.isPopular)
    .slice(0, limit)
}

// 関連記事取得
export const getRelatedArticles = (currentArticleId: string, limit: number = 3): FAQArticle[] => {
  const currentArticle = findArticleById(currentArticleId)
  if (!currentArticle || !currentArticle.relatedArticles) {
    return []
  }

  return currentArticle.relatedArticles
    .map(id => findArticleById(id))
    .filter((article): article is FAQArticle => article !== undefined)
    .slice(0, limit)
}

// 記事検索
export const searchArticles = (query: string): FAQArticle[] => {
  const lowercaseQuery = query.toLowerCase()
  return allFAQArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.description.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// 目次生成
export const generateTableOfContents = (article: FAQArticle): TableOfContents[] => {
  return article.content
    .filter(content => content.type === 'heading')
    .map((heading, index) => ({
      id: `heading-${index}`,
      title: heading.content,
      level: heading.level || 2
    }))
}

// 統計情報取得
export const getFAQStats = () => {
  return {
    totalArticles: allFAQArticles.length,
    totalCategories: faqCategories.length,
    popularArticles: allFAQArticles.filter(article => article.isPopular).length,
    averageReadTime: Math.round(
      allFAQArticles.reduce((sum, article) => sum + article.estimatedReadTime, 0) / allFAQArticles.length
    )
  }
}

// カテゴリ別統計
export const getCategoryStats = (categoryId: string) => {
  const categoryArticles = getArticlesByCategory(categoryId)
  return {
    totalArticles: categoryArticles.length,
    popularArticles: categoryArticles.filter(article => article.isPopular).length,
    averageReadTime: categoryArticles.length > 0 
      ? Math.round(categoryArticles.reduce((sum, article) => sum + article.estimatedReadTime, 0) / categoryArticles.length)
      : 0
  }
}

// 型エクスポート（re-export）
export type { FAQArticle, FAQContent, FAQCategory, TableOfContents } from './types'