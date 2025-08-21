// src/data/faq/types.ts
export interface FAQArticle {
  id: string
  title: string
  category: string
  categoryId: string
  description: string
  content: FAQContent[]
  tags: string[]
  isPopular: boolean
  lastUpdated: string
  estimatedReadTime: number
  views?: number
  relatedArticles?: string[]
}

export interface FAQContent {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'warning' | 'info' | 'steps' | 'image'
  content: string
  items?: string[]
  language?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface FAQCategory {
  id: string
  title: string
  description: string
  icon: string
  color: string
  articles: FAQArticle[]
}

export interface TableOfContents {
  id: string
  title: string
  level: number
}

// 共通のコンテンツブロック
export const createHeading = (content: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 2): FAQContent => ({
  type: 'heading',
  content,
  level
})

export const createParagraph = (content: string): FAQContent => ({
  type: 'paragraph',
  content
})

export const createList = (items: string[]): FAQContent => ({
  type: 'list',
  content: '',
  items
})

export const createSteps = (items: string[]): FAQContent => ({
  type: 'steps',
  content: '',
  items
})

export const createWarning = (content: string): FAQContent => ({
  type: 'warning',
  content
})

export const createInfo = (content: string): FAQContent => ({
  type: 'info',
  content
})

export const createCode = (content: string, language: string = 'text'): FAQContent => ({
  type: 'code',
  content,
  language
})