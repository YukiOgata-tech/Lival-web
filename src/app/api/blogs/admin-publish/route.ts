// src/app/api/blogs/admin-publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole, getServerUserId } from '@/lib/auth/server'
import { BlogService } from '@/lib/firebase/blog'
import { adminDb } from '@/lib/firebase-admin'

// POST /api/blogs/admin-publish - Admin direct publish
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = await getServerUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, categories = [], tags = [], visibility = 'public', coverPath = '', createdAt } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create blog then approve
    const text = (content || '').replace(/<[^>]*>/g, '').trim()
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
        authorName: 'Admin',
        status: 'approved',
        viewCount: 0,
        version: 1,
        createdAt: createdAt ? new Date(createdAt) : now,
        updatedAt: now,
        approvedAt: now,
      })
      await adminDb.collection('auditLogs').doc().set({
        actorId: userId,
        actorName: '',
        action: 'blog_published',
        blogId,
        timestamp: now,
        newValue: { title, categories, tags, visibility },
      })
    } else {
      blogId = await BlogService.createBlog({
        title,
        content,
        categories,
        tags,
        visibility,
        coverPath,
        excerpt,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
        authorId: userId,
        authorName: 'Admin',
      }, userId!)
      await BlogService.updateBlog(blogId, { status: 'approved', approvedAt: new Date() }, userId!)
    }

    return NextResponse.json({ success: true, blogId, message: 'Blog published successfully', status: 'approved' })

  } catch (error) {
    const code = (error as any)?.code || (error as any)?.message || 'unknown'
    console.error('Error publishing blog:', { code, error })
    const status = code === 'permission-denied' || code === 'unauthenticated' ? 403 : 500
    const details = typeof (error as any)?.message === 'string' ? (error as any).message : undefined
    return NextResponse.json(
      { error: 'Failed to publish blog', code, details },
      { status }
    )
  }
}
