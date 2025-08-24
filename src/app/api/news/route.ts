// src/app/api/news/route.ts

import { NextRequest, NextResponse } from 'next/server'
// import { getNewsList, createNews, getNewsStats } from '@/lib/firebase/news'
import { NewsFormData, NewsFilter } from '@/lib/types/news'

// GET /api/news - お知らせ一覧取得
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/news called')
    
    // まず基本的なレスポンスをテスト
    const { searchParams } = new URL(request.url)
    console.log('Search params:', Object.fromEntries(searchParams.entries()))
    
    // 管理者用か一般用かを判定
    const isAdmin = searchParams.get('admin') === 'true'
    console.log('Is admin request:', isAdmin)
    
    // テスト用のモックデータを返す（一時的）
    const mockNews = {
      news: [],
      total: 0,
      hasMore: false
    }
    
    console.log('Returning mock data')
    return NextResponse.json(mockNews)

  } catch (error) {
    console.error('Error in GET /api/news:', error)
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
    const body = await request.json()
    const { title, content, priority, type, status } = body as NewsFormData

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }

    // 作成者情報（実際の実装では認証から取得）
    const authorId = 'admin-user-id' // TODO: 認証システムから取得
    const authorName = '管理者' // TODO: 認証システムから取得

    // お知らせ作成
    const newsId = await createNews(
      {
        title,
        content,
        priority: priority || 'normal',
        type: type || 'general',
        status: status || 'draft',
        publishedAt: status === 'published' ? new Date() : null
      },
      authorId,
      authorName
    )

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
    return NextResponse.json(
      { error: 'お知らせの作成に失敗しました' },
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