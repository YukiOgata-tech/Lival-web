// src/app/api/blogs/admin-publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'

// POST /api/blogs/admin-publish - Admin direct publish
export async function POST(request: NextRequest) {
  try {
    const userRole = await getServerUserRole(request)
    const userId = request.headers.get('x-user-id')
    
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
    const { title, content, categories, tags, visibility, coverPath } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Mock implementation - simulate direct publish
    // In production, this would:
    // 1. Create blog with status: 'approved'
    // 2. Set publishedAt: new Date()
    // 3. Skip review process
    const mockBlogId = `admin_blog_${Date.now()}`

    console.log(`Admin direct publish: Blog ${mockBlogId} published by ${userId}`, {
      title,
      categories,
      visibility,
      status: 'approved'
    })

    return NextResponse.json({
      success: true,
      blogId: mockBlogId,
      message: 'Blog published successfully',
      status: 'approved',
      publishedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error publishing blog:', error)
    return NextResponse.json(
      { error: 'Failed to publish blog' },
      { status: 500 }
    )
  }
}