// src/lib/firebase/news.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { News, NewsFilter, NewsListResponse, newsConverter } from '@/lib/types/news'

// Collection reference
const newsCollection = collection(db, 'news').withConverter(newsConverter)

/**
 * お知らせを取得（一覧用）
 */
export async function getNewsList(
  filters: NewsFilter = {},
  page = 1,
  limitCount = 10
): Promise<NewsListResponse> {
  try {
    console.log('getNewsList called with:', { filters, page, limitCount })
    
    // 基本的なクエリから始める
    let q = query(newsCollection, orderBy('createdAt', 'desc'))

    // ステータスフィルター
    if (filters.status === 'all') {
      // 'all' の場合はステータスフィルターを適用しない（全て取得）
      // q にはステータス条件を追加しない
    } else if (filters.status) {
      // 特定のステータスが指定されている場合
      q = query(q, where('status', '==', filters.status))
    } else {
      // デフォルトでは公開済みのみ
      q = query(q, where('status', '==', 'published'))
    }

    // その他のフィルター
    if (filters.type) {
      q = query(q, where('type', '==', filters.type))
    }
    if (filters.priority) {
      q = query(q, where('priority', '==', filters.priority))
    }

    // 取得制限
    q = query(q, limit(limitCount))

    console.log('Executing Firestore query...')
    const snapshot = await getDocs(q)
    console.log('Query result:', snapshot.size, 'documents')

    if (snapshot.empty) {
      console.warn('⚠️ No documents found in news collection')
      return {
        news: [],
        total: 0,
        hasMore: false
      }
    }

    const news = snapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Document data:', { id: doc.id, title: data.title, status: data.status })
      return data
    })

    // 検索フィルター（クライアント側）
    let filteredNews = news
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm)
      )
    }

    const result = {
      news: filteredNews,
      total: filteredNews.length,
      hasMore: false // 簡単のため一旦false
    }
    
    console.log('getNewsList result:', result)
    return result
  } catch (error) {
    console.error('❌ Error fetching news list:', error)
    console.error('Error details:', {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      code: (error as any)?.code,
      stack: (error as Error)?.stack
    })
    throw error
  }
}

/**
 * 公開中のお知らせ一覧を取得
 */
export async function getPublishedNews(limitCount = 20): Promise<News[]> {
  try {
    const q = query(
      newsCollection,
      where('status', '==', 'published'),
      orderBy('priority', 'desc'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error fetching published news:', error)
    throw new Error('お知らせの取得に失敗しました')
  }
}

/**
 * お知らせを1件取得
 */
export async function getNewsById(id: string): Promise<News | null> {
  try {
    const docRef = doc(newsCollection, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data()
  } catch (error) {
    console.error('Error fetching news:', error)
    throw new Error('お知らせの取得に失敗しました')
  }
}

/**
 * お知らせを作成
 */
export async function createNews(
  newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>,
  authorId: string,
  authorName: string
): Promise<string> {
  try {
    // converterを使わない通常のコレクション参照を作成
    const newsCollectionRef = collection(db, 'news')
    const docRef = doc(newsCollectionRef)
    const now = Timestamp.now()

    // Firestore用のデータオブジェクトを作成（Timestampを使用）
    const news = {
      ...newsData,
      authorId,
      authorName,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      excerpt: generateExcerpt(newsData.content),
      publishedAt: newsData.status === 'published' ? now : null
    }

    await setDoc(docRef, news)
    return docRef.id
  } catch (error) {
    console.error('Error creating news:', error)
    console.error('Error details:', {
      code: error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined,
      message: error && typeof error === 'object' && 'message' in error ? (error as { message: unknown }).message : undefined,
      authState: !!authorId,
      newsData: newsData
    })
    throw error // 元のエラーをそのまま投げる
  }
}

/**
 * お知らせを更新
 */
export async function updateNews(
  id: string,
  updateData: Partial<Omit<News, 'id' | 'createdAt' | 'authorId' | 'viewCount'>>
): Promise<void> {
  try {
    const docRef = doc(newsCollection, id)
    
    const updates: Record<string, unknown> = {
      ...updateData,
      updatedAt: serverTimestamp(),
    }

    // ステータスが published に変更された場合、publishedAt を設定
    if (updateData.status === 'published') {
      const currentDoc = await getDoc(docRef)
      const currentData = currentDoc.data()
      if (currentData && !currentData.publishedAt) {
        updates.publishedAt = serverTimestamp()
      }
    }

    // コンテンツが更新された場合、抜粋を更新
    if (updateData.content) {
      updates.excerpt = generateExcerpt(updateData.content)
    }

    await updateDoc(docRef, updates)
  } catch (error) {
    console.error('Error updating news:', error)
    throw new Error('お知らせの更新に失敗しました')
  }
}

/**
 * お知らせを削除
 */
export async function deleteNews(id: string): Promise<void> {
  try {
    const docRef = doc(newsCollection, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting news:', error)
    throw new Error('お知らせの削除に失敗しました')
  }
}

/**
 * お知らせの閲覧数を増加
 */
export async function incrementNewsViewCount(id: string): Promise<void> {
  try {
    const docRef = doc(newsCollection, id)
    await updateDoc(docRef, {
      viewCount: increment(1)
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    // 閲覧数の更新は失敗してもエラーにしない
  }
}

/**
 * 最新の重要なお知らせを取得（ヘッダー表示用）
 */
export async function getImportantNews(limitCount = 3): Promise<News[]> {
  try {
    const q = query(
      newsCollection,
      where('status', '==', 'published'),
      where('priority', 'in', ['urgent', 'high']),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error fetching important news:', error)
    return []
  }
}

/**
 * コンテンツから抜粋を生成
 */
function generateExcerpt(content: string, maxLength = 150): string {
  // HTMLタグを除去
  const text = content.replace(/<[^>]*>/g, '').trim()
  
  if (text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * お知らせの統計情報を取得
 */
export async function getNewsStats(): Promise<{
  total: number
  published: number
  draft: number
  archived: number
}> {
  try {
    const [totalSnap, publishedSnap, draftSnap, archivedSnap] = await Promise.all([
      getDocs(query(newsCollection)),
      getDocs(query(newsCollection, where('status', '==', 'published'))),
      getDocs(query(newsCollection, where('status', '==', 'draft'))),
      getDocs(query(newsCollection, where('status', '==', 'archived')))
    ])

    return {
      total: totalSnap.size,
      published: publishedSnap.size,
      draft: draftSnap.size,
      archived: archivedSnap.size
    }
  } catch (error) {
    console.error('Error fetching news stats:', error)
    return {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0
    }
  }
}