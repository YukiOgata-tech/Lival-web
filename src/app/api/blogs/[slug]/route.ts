// src/app/api/blogs/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerUserRole } from '@/lib/auth/server'
import { BlogService } from '@/lib/firebase/blog'
import { UserRole } from '@/lib/types/blog'

// GET /api/blogs/[slug] - Get blog by slug (Firestore)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const userRole = await getServerUserRole(request)
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const blog = await BlogService.getBlogBySlug(slug)
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    const canAccessFull = BlogService.canAccessFullContent(blog, userRole as UserRole)
    const isTeaser = blog.visibility === 'teaser' || (blog.visibility === 'premium' && !canAccessFull)

    // Teaser時は本文を短縮（contentがある場合）
    const safeBlog = { ...blog }
    if (isTeaser && safeBlog.content) {
      safeBlog.content = `${safeBlog.content.substring(0, 300)}...`
    }

    return NextResponse.json({
      blog: safeBlog,
      isTeaser,
      canAccess: canAccessFull,
      userRole
    })

  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// Removed mock helper (use BlogService.canAccessFullContent)

// PUT /api/blogs/[slug] - Update blog (simplified)
export async function PUT(
  _request: NextRequest,
  { params: _params }: { params: Promise<{ slug: string }> }
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
