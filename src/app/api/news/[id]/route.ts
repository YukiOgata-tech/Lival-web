// src/app/api/news/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getNewsById, updateNews, deleteNews, incrementNewsViewCount } from '@/lib/firebase/news'
import { NewsFormData } from '@/lib/types/news'

// GET /api/news/[id] - 個別お知らせ取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const incrementView = searchParams.get('view') === 'true'

    const news = await getNewsById(id)
    
    if (!news) {
      return NextResponse.json(
        { error: 'お知らせが見つかりません' },
        { status: 404 }
      )
    }

    // 閲覧数を増加（一般ユーザーの場合のみ）
    if (incrementView && news.status === 'published') {
      await incrementNewsViewCount(id)
    }

    return NextResponse.json(news)

  } catch (error) {
    console.error('Error in GET /api/news/[id]:', error)
    return NextResponse.json(
      { error: 'お知らせの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// PUT /api/news/[id] - お知らせ更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, priority, type, status } = body as NewsFormData

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }

    // 既存のお知らせ確認
    const existingNews = await getNewsById(id)
    if (!existingNews) {
      return NextResponse.json(
        { error: 'お知らせが見つかりません' },
        { status: 404 }
      )
    }

    // お知らせ更新
    await updateNews(id, {
      title,
      content,
      priority: priority || 'normal',
      type: type || 'general',
      status: status || 'draft'
    })

    return NextResponse.json({
      success: true,
      message: 'お知らせを更新しました'
    })

  } catch (error) {
    console.error('Error in PUT /api/news/[id]:', error)
    return NextResponse.json(
      { error: 'お知らせの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// DELETE /api/news/[id] - お知らせ削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 既存のお知らせ確認
    const existingNews = await getNewsById(id)
    if (!existingNews) {
      return NextResponse.json(
        { error: 'お知らせが見つかりません' },
        { status: 404 }
      )
    }

    // お知らせ削除
    await deleteNews(id)

    return NextResponse.json({
      success: true,
      message: 'お知らせを削除しました'
    })

  } catch (error) {
    console.error('Error in DELETE /api/news/[id]:', error)
    return NextResponse.json(
      { error: 'お知らせの削除に失敗しました' },
      { status: 500 }
    )
  }
}