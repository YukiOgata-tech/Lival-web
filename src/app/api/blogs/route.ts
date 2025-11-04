// src/app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole, getServerUserId } from '@/lib/auth/server'
import { adminDb } from '@/lib/firebase-admin'
import { BlogService } from '@/lib/firebase/blog'
import { UserRole } from '@/lib/types/blog'

// GET /api/blogs - Get blogs list with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const q = searchParams.get('q') || undefined
    const statusParam = searchParams.get('status') || undefined

    const userRole = await getServerUserRole(request)
    
    // Admin SDK がある場合はそちらを優先（サーバー権限で安定動作）
    if (adminDb) {
      if (q) {
        // まず approved のみ広めに取得し、サーバー側でフィルタリング
        const snap = await adminDb
          .collection('blogs')
          .where('status', '==', 'approved')
          .orderBy('createdAt', 'desc')
          .limit(200)
          .get()
        let list = snap.docs.map(d => d.data() as any)
        const term = q.toLowerCase()
        list = list.filter(b => (
          (b.title || '').toLowerCase().includes(term) ||
          (b.excerpt || '').toLowerCase().includes(term) ||
          Array.isArray(b.tags) && b.tags.some((t: string) => (t || '').toLowerCase().includes(term))
        ))
        // status filter（未指定なら approved のみ）
        if (statusParam) {
          list = list.filter(b => b.status === statusParam)
        } else {
          list = list.filter(b => b.status === 'approved')
        }
        if (category) list = list.filter(b => Array.isArray(b.categories) && b.categories.includes(category))
        if (tag) list = list.filter(b => Array.isArray(b.tags) && b.tags.includes(tag))
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginated = list.slice(startIndex, endIndex)
        const blogsWithFlags = paginated.map(blog => ({
          ...blog,
          content: undefined,
          isTeaser: blog.visibility === 'teaser' || (blog.visibility === 'premium' && !BlogService.canAccessFullContent(blog, userRole as UserRole))
        }))
        return NextResponse.json({
          blogs: blogsWithFlags,
          pagination: {
            currentPage: page,
            hasMore: endIndex < list.length,
            totalCount: list.length,
          },
        })
      }

      // 通常取得（インデックス不要の安全策: createdAt順で広めに取得し、サーバー側フィルタ）
      const snap = await adminDb
        .collection('blogs')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get()
      let list = snap.docs.map(d => d.data() as any)
      if (statusParam) {
        list = list.filter(b => b.status === statusParam)
      } else {
        list = list.filter(b => b.status === 'approved')
      }
      if (category) list = list.filter(b => Array.isArray(b.categories) && b.categories.includes(category))
      if (tag) list = list.filter(b => Array.isArray(b.tags) && b.tags.includes(tag))
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginated = list.slice(startIndex, endIndex)
      const blogsWithFlags = paginated.map(blog => ({
        ...blog,
        content: undefined,
        isTeaser: blog.visibility === 'teaser' || (blog.visibility === 'premium' && !BlogService.canAccessFullContent(blog, userRole as UserRole))
      }))
      return NextResponse.json({
        blogs: blogsWithFlags,
        pagination: {
          currentPage: page,
          hasMore: endIndex < list.length,
          totalCount: list.length,
        },
      })
    }

    // Admin SDK がない場合: 既存のクライアントSDKロジック
    if (q) {
      const searched = await BlogService.searchBlogs(q, userRole as UserRole)
      const byCategory = category ? searched.filter(b => b.categories.includes(category)) : searched
      const byTag = tag ? byCategory.filter(b => b.tags.includes(tag)) : byCategory
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginated = byTag.slice(startIndex, endIndex)
      const blogsWithFlags = paginated.map(blog => ({
        ...blog,
        content: undefined,
        isTeaser: blog.visibility === 'teaser' || (blog.visibility === 'premium' && !BlogService.canAccessFullContent(blog, userRole as UserRole))
      }))
      return NextResponse.json({
        blogs: blogsWithFlags,
        pagination: {
          currentPage: page,
          hasMore: endIndex < byTag.length,
          totalCount: byTag.length
        }
      })
    }

    const statuses = statusParam ? [statusParam as any] : ['approved']
    const { blogs, hasMore } = await BlogService.getBlogs({
      pageSize,
      category,
      tag,
      status: statuses
    })
    const blogsWithFlags = blogs.map(blog => ({
      ...blog,
      content: undefined,
      isTeaser: blog.visibility === 'teaser' || (blog.visibility === 'premium' && !BlogService.canAccessFullContent(blog, userRole as UserRole))
    }))
    return NextResponse.json({
      blogs: blogsWithFlags,
      pagination: { currentPage: page, hasMore, totalCount: blogsWithFlags.length }
    })

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// Removed mock helper (real access check is in BlogService)

// POST /api/blogs - Create new blog (draft)
export async function POST(request: NextRequest) {
  try {
    const userId = await getServerUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, categories = [], tags = [], visibility = 'teaser', coverPath = '', createdAt } = body as {
      title?: string
      content?: string
      categories?: string[]
      tags?: string[]
      visibility?: 'public'|'teaser'|'premium'
      coverPath?: string
      createdAt?: string
    }

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Excerpt 生成（先頭300文字、HTML除去）
    const text = content.replace(/<[^>]*>/g, '').trim()
    const excerpt = text.length > 300 ? text.substring(0, 300).trim() + '…' : text

    let blogId: string
    if (adminDb) {
      const ref = adminDb.collection('blogs').doc()
      blogId = ref.id
      const now = new Date()
      await ref.set({
        id: blogId,
        slug: await BlogService.generateUniqueSlug(title),
        title,
        content,
        categories,
        tags,
        visibility,
        coverPath,
        excerpt,
        authorId: userId,
        authorName: 'Anonymous',
        status: 'draft',
        viewCount: 0,
        version: 1,
        createdAt: createdAt ? new Date(createdAt) : now,
        updatedAt: now,
        approvedAt: null,
      })
      await adminDb.collection('audit_logs').doc().set({
        actorId: userId,
        actorName: '',
        action: 'blog_created',
        blogId,
        timestamp: now,
        newValue: { title, categories, tags, visibility },
      })
    } else {
      blogId = await BlogService.createBlog(
        {
          title,
          content,
          categories,
          tags,
          visibility,
          coverPath,
          excerpt,
          ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
          authorId: userId,
          authorName: 'Anonymous',
        },
        userId
      )
    }

    return NextResponse.json({ success: true, blogId }, { status: 201 })

  } catch (error) {
    const code = (error as any)?.code || (error as any)?.message || 'unknown'
    console.error('Error creating blog:', { code, error })
    const status = code === 'permission-denied' || code === 'unauthenticated' ? 403 : 500
    const details = typeof (error as any)?.message === 'string' ? (error as any).message : undefined
    return NextResponse.json(
      { error: 'Failed to create blog', code, details },
      { status }
    )
  }
}
