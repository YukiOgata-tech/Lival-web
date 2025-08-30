// src/app/api/blogs/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'

// Mock blog data (same as in main route)
const mockBlogs = [
  {
    id: '1',
    title: 'Next.js 15の新機能を徹底解説',
    slug: 'nextjs-15-new-features',
    excerpt: 'Next.js 15がリリースされました。React 19との連携、新しいキャッシュシステム、パフォーマンス改善など、注目の新機能を詳しく見ていきましょう。',
    content: '<p>Next.js 15がついにリリースされました。この記事では、React 19との連携、新しいキャッシュシステム、パフォーマンス改善など、注目の新機能を詳しく解説します。</p><p>まず、React 19との連携について見ていきましょう。Next.js 15では、React 19の新機能を完全にサポートし、より効率的なレンダリングが可能になりました。特にサーバーサイドレンダリングの改善は注目すべき点です。</p><p>次に、新しいキャッシュシステムについて詳しく説明します。従来のキャッシュシステムから大幅に改良され、パフォーマンスの向上とメモリ使用量の削減を実現しています。</p>',
    authorId: 'user123',
    authorName: '田中太郎',
    categories: ['技術', 'フロントエンド'],
    tags: ['Next.js', 'React', 'JavaScript'],
    status: 'approved',
    visibility: 'public',
    readTimeMins: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'TypeScript 5.0で変わる開発体験',
    slug: 'typescript-5-development-experience',
    excerpt: 'TypeScript 5.0の新機能により、より型安全で効率的な開発が可能になります。Decorators、const assertions、Template Literal Typesの活用法を紹介します。',
    content: '<p>TypeScript 5.0の新機能により、より型安全で効率的な開発が可能になります。この記事では、主要な新機能について詳しく解説していきます。</p><p>まず、Decoratorsについて見ていきましょう。従来の実験的な実装から正式版となったDecoratorsは、クラスやメソッドの拡張を簡潔に行えるようになります。</p>',
    authorId: 'user456',
    authorName: '佐藤花子',
    categories: ['技術', 'TypeScript'],
    tags: ['TypeScript', 'JavaScript', '型安全'],
    status: 'approved',
    visibility: 'teaser',
    readTimeMins: 8,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    publishedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'AI活用学習法：効率的な勉強のコツ',
    slug: 'ai-powered-learning-methods',
    excerpt: 'AI技術を活用した新しい学習法について解説します。個人に最適化された学習プラン、自動採点システム、進捗管理など、AI学習の可能性を探ります。',
    content: '<p>AI技術を活用した新しい学習法について解説します。現代の教育現場では、AIが学習者一人一人に最適化された学習体験を提供できるようになってきました。</p><p>個人に最適化された学習プランの作成から始まり、リアルタイムでの学習進捗の分析、そして効果的な復習タイミングの提案まで、AIは学習のあらゆる場面でサポートを提供します。</p>',
    authorId: 'admin',
    authorName: 'Lival AI編集部',
    categories: ['学習法', 'AI'],
    tags: ['AI', '学習', '効率化'],
    status: 'approved',
    visibility: 'premium',
    readTimeMins: 12,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    publishedAt: new Date('2024-01-05')
  }
]

// GET /api/blogs/[slug] - Get blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const userRole = await getServerUserRole(request)
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const blog = mockBlogs.find(b => b.slug === slug)
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Determine content access
    const canAccessFull = canAccessFullContent(blog, userRole)
    const isTeaser = blog.visibility === 'teaser' || (blog.visibility === 'premium' && !canAccessFull)

    // Prepare response based on access level
    const responseData = {
      ...blog,
      isTeaser,
      canAccess: canAccessFull,
      userRole
    }

    if (isTeaser && userRole !== 'admin') {
      // Return only teaser content (first 300 characters)
      responseData.content = blog.content?.substring(0, 300) + '...'
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// Helper function to check content access
function canAccessFullContent(blog: { visibility: string }, userRole: string): boolean {
  switch (blog.visibility) {
    case 'public':
      return true
    case 'teaser':
      return userRole === 'subscriber' || userRole === 'admin'
    case 'premium':
      return userRole === 'subscriber' || userRole === 'admin'
    default:
      return userRole === 'admin'
  }
}

// PUT /api/blogs/[slug] - Update blog (simplified)
export async function PUT(
  _request: NextRequest,
  { params: _params }: { params: { slug: string } }
) {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Blog update not implemented in mock version' 
    })

  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[slug] - Delete blog (simplified)
export async function DELETE() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Blog deletion not implemented in mock version' 
    })

  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}