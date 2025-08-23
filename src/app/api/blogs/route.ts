// src/app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'

// Mock blog data for testing
const mockBlogs = [
  {
    id: '1',
    title: 'Next.js 15の新機能を徹底解説',
    slug: 'nextjs-15-new-features',
    excerpt: 'Next.js 15がリリースされました。React 19との連携、新しいキャッシュシステム、パフォーマンス改善など、注目の新機能を詳しく見ていきましょう。',
    content: '<p>Next.js 15がついにリリースされました。この記事では、React 19との連携、新しいキャッシュシステム、パフォーマンス改善など、注目の新機能を詳しく解説します。</p>',
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
    content: '<p>TypeScript 5.0の新機能により、より型安全で効率的な開発が可能になります。</p>',
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
    content: '<p>AI技術を活用した新しい学習法について解説します。</p>',
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

// GET /api/blogs - Get blogs list with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const q = searchParams.get('q') || undefined

    const userRole = await getServerUserRole(request)
    
    // Filter blogs based on search, category, tag
    let filteredBlogs = mockBlogs

    if (q) {
      filteredBlogs = mockBlogs.filter(blog => 
        blog.title.toLowerCase().includes(q.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
      )
    }

    if (category) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.categories.includes(category)
      )
    }

    if (tag) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.tags.includes(tag)
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

    // Filter content based on user role and visibility
    const blogsWithAccessInfo = paginatedBlogs.map(blog => {
      const canAccessFull = canAccessFullContent(blog, userRole)
      
      return {
        ...blog,
        content: undefined, // Never send full content in list view
        isTeaser: blog.visibility === 'teaser' || (blog.visibility === 'premium' && !canAccessFull)
      }
    })

    return NextResponse.json({
      blogs: blogsWithAccessInfo,
      pagination: {
        currentPage: page,
        hasMore: endIndex < filteredBlogs.length,
        totalCount: filteredBlogs.length
      }
    })

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// Helper function to check content access
function canAccessFullContent(blog: any, userRole: string): boolean {
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

// POST /api/blogs - Create new blog (draft)
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = request.headers.get('x-user-id') || 'mock-user-id'
    
    const body = await request.json()
    const { title, content, categories, tags, visibility, coverPath } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Mock blog creation
    const mockBlogId = `blog_${Date.now()}`

    return NextResponse.json({ 
      success: true, 
      blogId: mockBlogId,
      message: 'Blog created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}