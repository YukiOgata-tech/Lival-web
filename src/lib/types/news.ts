// src/lib/types/news.ts

export type NewsPriority = 'low' | 'normal' | 'high' | 'urgent'
export type NewsType = 'general' | 'maintenance' | 'feature' | 'system'
export type NewsStatus = 'draft' | 'published' | 'archived' | 'all'

export interface News {
  id: string
  title: string
  content: string
  excerpt: string
  priority: NewsPriority
  type: NewsType
  status: NewsStatus
  authorId: string
  authorName: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  viewCount: number
}

export interface NewsFormData {
  title: string
  content: string
  priority: NewsPriority
  type: NewsType
  status: NewsStatus
}

export interface NewsFilter {
  type?: NewsType
  priority?: NewsPriority
  status?: NewsStatus
  search?: string
}

export interface NewsListResponse {
  news: News[]
  total: number
  hasMore: boolean
}

// お知らせの優先度に応じた表示設定
export const NEWS_PRIORITY_CONFIG = {
  urgent: {
    label: '緊急',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  high: {
    label: '重要',
    color: 'orange', 
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  normal: {
    label: '通常',
    color: 'blue',
    bgColor: 'bg-blue-50', 
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  low: {
    label: '参考',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700', 
    borderColor: 'border-gray-200'
  }
} as const

// お知らせタイプの表示設定
export const NEWS_TYPE_CONFIG = {
  general: {
    label: 'お知らせ',
    icon: '📰',
    cardBgFrom: 'from-gray-50',
    cardBgTo: 'to-white',
    cardBorder: 'border-gray-200',
    watermarkFrom: 'from-gray-300',
    watermarkTo: 'to-gray-500'
  },
  maintenance: {
    label: 'メンテナンス',
    icon: '🛠️',
    cardBgFrom: 'from-amber-50',
    cardBgTo: 'to-amber-100',
    cardBorder: 'border-amber-200',
    watermarkFrom: 'from-amber-300',
    watermarkTo: 'to-amber-500'
  },
  feature: {
    label: '新機能',
    icon: '✨',
    cardBgFrom: 'from-emerald-50',
    cardBgTo: 'to-emerald-100',
    cardBorder: 'border-emerald-200',
    watermarkFrom: 'from-emerald-300',
    watermarkTo: 'to-emerald-600'
  },
  system: {
    label: 'システム',
    icon: '⚙️',
    cardBgFrom: 'from-indigo-50',
    cardBgTo: 'to-indigo-100',
    cardBorder: 'border-indigo-200',
    watermarkFrom: 'from-indigo-300',
    watermarkTo: 'to-indigo-600'
  }
} as const

// Firestore converter
export const newsConverter = {
  toFirestore: (news: Omit<News, 'id'>) => {
    // DateオブジェクトをFirestore Timestampに変換
    const toTimestamp = (date: Date | null) => {
      if (!date) return null
      if (date instanceof Date) {
        return date // Firestoreが自動的にTimestampに変換してくれる
      }
      return date
    }

    return {
      ...news,
      createdAt: toTimestamp(news.createdAt || new Date()),
      updatedAt: toTimestamp(new Date()),
      publishedAt: toTimestamp(news.publishedAt),
    }
  },
  fromFirestore: (snapshot: { id: string; data: () => any }) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || null,
    } as News
  }
}
