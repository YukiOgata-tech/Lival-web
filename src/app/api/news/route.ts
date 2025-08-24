// src/app/api/news/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getNewsList, createNews, getNewsStats } from '@/lib/firebase/news'
import { NewsFormData, NewsFilter } from '@/lib/types/news'
import { serverTimestamp } from 'firebase/firestore'

// GET /api/news - お知らせ一覧取得
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/news called')
    
    const { searchParams } = new URL(request.url)
    console.log('Search params:', Object.fromEntries(searchParams.entries()))
    
    // 管理者用か一般用かを判定
    const isAdmin = searchParams.get('admin') === 'true'
    console.log('Is admin request:', isAdmin)
    
    // クエリパラメータを解析
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    
    // フィルターオブジェクトを作成
    const filter: NewsFilter = {}
    if (status) filter.status = status as any
    if (type) filter.type = type as any
    if (priority) filter.priority = priority as any
    if (search) filter.search = search
    
    console.log('Filter params:', { page, limit, filter })
    
    // Firestoreからデータを取得
    const result = await getNewsList(filter, page, limit)
    console.log('Retrieved news:', result)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in GET /api/news:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code,
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: 'お知らせの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/news - お知らせ作成
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/news called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { title, content, priority, type, status } = body as NewsFormData

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }

    console.log('Validation passed, creating news...')

    // 作成者情報（実際の実装では認証から取得）
    const authorId = 'admin-user-id' // TODO: 認証システムから取得
    const authorName = '管理者' // TODO: 認証システムから取得

    // お知らせ作成
    const newsData = {
      title,
      content,
      excerpt: '', // createNews内で生成される
      priority: priority || 'normal',
      type: type || 'general', 
      status: status || 'draft',
      authorId,
      authorName,
      publishedAt: status === 'published' ? new Date() : null
    }

    console.log('News data prepared:', newsData)
    const newsId = await createNews(newsData, authorId, authorName)
    console.log('News created with ID:', newsId)

    return NextResponse.json(
      { 
        success: true, 
        id: newsId,
        message: 'お知らせを作成しました' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in POST /api/news:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code,
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: 'お知らせの作成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/news/stats - 統計情報取得（管理者用）
export async function PATCH() {
  try {
    const stats = await getNewsStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in PATCH /api/news/stats:', error)
    return NextResponse.json(
      { error: '統計情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}